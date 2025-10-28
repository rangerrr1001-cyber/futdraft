import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import { getUTCDate, getNextUTCMidnight, isBeforeToday } from '../utils/helpers';

const MAX_SPINS_PER_DAY = 3;

export async function checkSpinAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    // Get user spin data
    const result = await pool.query(
      'SELECT last_spin_date, spin_count_today FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result.rows[0];
    const today = getUTCDate();
    const lastSpinDate = user.last_spin_date;
    let spinCount = user.spin_count_today || 0;

    // Reset spin count if last spin was before today
    if (isBeforeToday(lastSpinDate)) {
      spinCount = 0;
      // Update in database
      await pool.query(
        'UPDATE users SET spin_count_today = 0, last_spin_date = $1 WHERE id = $2',
        [today, userId]
      );
    }

    const remainingSpins = MAX_SPINS_PER_DAY - spinCount;
    const canSpin = remainingSpins > 0;
    const nextResetTime = getNextUTCMidnight().toISOString();

    res.status(200).json({
      canSpin,
      remainingSpins,
      nextResetTime,
    });
  } catch (error) {
    console.error('Check spin availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function executeSpin(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userId = req.userId;
    const today = getUTCDate();

    // Get user spin data with row lock
    const userResult = await client.query(
      'SELECT last_spin_date, spin_count_today FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = userResult.rows[0];
    const lastSpinDate = user.last_spin_date;
    let spinCount = user.spin_count_today || 0;

    // Reset if last spin was before today
    if (isBeforeToday(lastSpinDate)) {
      spinCount = 0;
    }

    // Check if user has spins remaining
    if (spinCount >= MAX_SPINS_PER_DAY) {
      await client.query('ROLLBACK');
      const nextResetTime = getNextUTCMidnight().toISOString();
      res.status(403).json({
        error: `No spins remaining today. Resets at ${nextResetTime}`
      });
      return;
    }

    // Randomly select position
    const positionResult = await client.query(
      'SELECT name FROM positions ORDER BY RANDOM() LIMIT 1'
    );
    if (positionResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'No positions available' });
      return;
    }
    const selectedPosition = positionResult.rows[0].name;

    // Randomly select event
    const eventResult = await client.query(
      'SELECT name FROM events ORDER BY RANDOM() LIMIT 1'
    );
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'No events available' });
      return;
    }
    const selectedEvent = eventResult.rows[0].name;

    // Randomly select OVR range
    const ovrRangeResult = await client.query(
      'SELECT label, min_ovr, max_ovr FROM ovr_ranges ORDER BY RANDOM() LIMIT 1'
    );
    if (ovrRangeResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'No OVR ranges available' });
      return;
    }
    const selectedOvrRange = ovrRangeResult.rows[0];

    // Find random player matching filters
    const playerResult = await client.query(
      `SELECT * FROM players
       WHERE position = $1 AND event = $2 AND ovr BETWEEN $3 AND $4
       ORDER BY RANDOM() LIMIT 1`,
      [selectedPosition, selectedEvent, selectedOvrRange.min_ovr, selectedOvrRange.max_ovr]
    );

    if (playerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'No player found for this combination' });
      return;
    }

    const player = playerResult.rows[0];

    // Add player to user's inventory (allow duplicates)
    await client.query(
      'INSERT INTO user_players (user_id, player_id) VALUES ($1, $2)',
      [userId, player.id]
    );

    // Increment spin count and update last_spin_date
    await client.query(
      'UPDATE users SET spin_count_today = $1, last_spin_date = $2 WHERE id = $3',
      [spinCount + 1, today, userId]
    );

    await client.query('COMMIT');

    // Return success response
    res.status(200).json({
      spinResult: {
        position: selectedPosition,
        event: selectedEvent,
        ovrRange: selectedOvrRange.label,
      },
      player: {
        id: player.id,
        name: player.name,
        position: player.position,
        event: player.event,
        ovr: player.ovr,
        pace: player.pace,
        shooting: player.shooting,
        passing: player.passing,
        dribbling: player.dribbling,
        defending: player.defending,
        physical: player.physical,
        card_image_url: player.card_image_url,
      },
      remainingSpins: MAX_SPINS_PER_DAY - (spinCount + 1),
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Execute spin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function getSpinOptions(req: AuthRequest, res: Response): Promise<void> {
  try {
    // Get all positions
    const positionsResult = await pool.query('SELECT name FROM positions ORDER BY name');
    const positions = positionsResult.rows.map(row => row.name);

    // Get all events
    const eventsResult = await pool.query('SELECT name FROM events ORDER BY name');
    const events = eventsResult.rows.map(row => row.name);

    // Get all OVR ranges
    const ovrRangesResult = await pool.query('SELECT label, min_ovr as min, max_ovr as max FROM ovr_ranges ORDER BY min_ovr DESC');
    const ovrRanges = ovrRangesResult.rows.map(row => ({
      label: row.label,
      min: row.min,
      max: row.max,
    }));

    res.status(200).json({
      positions,
      events,
      ovrRanges,
    });
  } catch (error) {
    console.error('Get spin options error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
