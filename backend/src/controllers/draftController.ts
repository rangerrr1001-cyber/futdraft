import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import {
  getAllFormations,
  getPositionSlotsForFormation,
  isValidFormation,
  parsePositionFromSlot
} from '../services/formationHelper';
import { shuffleArray } from '../utils/helpers';

const DRAFT_EXPIRY_MINUTES = 30;

export async function startDraft(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { manager_id } = req.body;

    // Validation: manager_id (optional)
    if (manager_id !== undefined && typeof manager_id !== 'number') {
      res.status(400).json({ error: 'Invalid manager ID' });
      return;
    }

    // Verify manager exists if provided
    if (manager_id) {
      const managerCheck = await pool.query(
        'SELECT id FROM managers WHERE id = $1',
        [manager_id]
      );

      if (managerCheck.rows.length === 0) {
        res.status(400).json({ error: 'Manager not found' });
        return;
      }
    }

    // Generate 5 random formations
    const allFormations = getAllFormations();
    const selectedFormations = shuffleArray(allFormations).slice(0, 5);

    // Set expiry time (30 minutes from now)
    const expiresAt = new Date(Date.now() + DRAFT_EXPIRY_MINUTES * 60 * 1000);

    // Create draft with optional manager_id
    const result = await pool.query(
      'INSERT INTO drafts (user_id, manager_id, expires_at) VALUES ($1, $2, $3) RETURNING id, manager_id, expires_at',
      [userId, manager_id || null, expiresAt]
    );

    const draft = result.rows[0];

    res.status(200).json({
      draft_id: draft.id,
      manager_id: draft.manager_id,
      formations: selectedFormations,
      expires_at: draft.expires_at.toISOString(),
    });
  } catch (error) {
    console.error('Start draft error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function selectFormation(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;
    const { formation } = req.body;

    // Check if draft exists and belongs to user
    const draftCheck = await pool.query(
      'SELECT id, user_id, expires_at FROM drafts WHERE id = $1',
      [draftId]
    );

    if (draftCheck.rows.length === 0) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const draft = draftCheck.rows[0];

    if (draft.user_id !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    // Check if draft expired
    if (new Date(draft.expires_at) < new Date()) {
      res.status(410).json({ error: 'Draft has expired' });
      return;
    }

    // Validate formation
    if (!isValidFormation(formation)) {
      res.status(400).json({ error: 'Invalid formation selection' });
      return;
    }

    // Update draft with formation
    await pool.query(
      'UPDATE drafts SET formation = $1 WHERE id = $2',
      [formation, draftId]
    );

    // Get position slots for this formation
    const positionSlots = getPositionSlotsForFormation(formation);

    res.status(200).json({
      formation,
      position_slots: positionSlots,
    });
  } catch (error) {
    console.error('Select formation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPlayersForPosition(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;
    const positionSlot = req.params.position_slot;

    // Check draft
    const draftCheck = await pool.query(
      'SELECT id, user_id, expires_at FROM drafts WHERE id = $1',
      [draftId]
    );

    if (draftCheck.rows.length === 0) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const draft = draftCheck.rows[0];

    if (draft.user_id !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (new Date(draft.expires_at) < new Date()) {
      res.status(410).json({ error: 'Draft has expired' });
      return;
    }

    // Parse position from position_slot
    const position = parsePositionFromSlot(positionSlot);

    if (!position) {
      res.status(400).json({ error: 'Invalid position slot' });
      return;
    }

    // Get 5 random players for this position
    const playersResult = await pool.query(
      'SELECT * FROM players WHERE position = $1 ORDER BY RANDOM() LIMIT 5',
      [position]
    );

    const players = playersResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      position: row.position,
      event: row.event,
      ovr: row.ovr,
      pace: row.pace,
      shooting: row.shooting,
      passing: row.passing,
      dribbling: row.dribbling,
      defending: row.defending,
      physical: row.physical,
      card_image_url: row.card_image_url,
    }));

    res.status(200).json({
      position_slot: positionSlot,
      players,
    });
  } catch (error) {
    console.error('Get players for position error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function selectPlayer(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;
    const { position_slot, player_id } = req.body;

    await client.query('BEGIN');

    // Check draft
    const draftCheck = await client.query(
      'SELECT id, user_id, formation, expires_at FROM drafts WHERE id = $1',
      [draftId]
    );

    if (draftCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const draft = draftCheck.rows[0];

    if (draft.user_id !== userId) {
      await client.query('ROLLBACK');
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    if (new Date(draft.expires_at) < new Date()) {
      await client.query('ROLLBACK');
      res.status(410).json({ error: 'Draft has expired' });
      return;
    }

    if (!draft.formation) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Formation not selected yet' });
      return;
    }

    // Check if player exists
    const playerCheck = await client.query(
      'SELECT id, position FROM players WHERE id = $1',
      [player_id]
    );

    if (playerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    // Check if position slot is already filled
    const slotCheck = await client.query(
      'SELECT id FROM draft_players WHERE draft_id = $1 AND position_slot = $2',
      [draftId, position_slot]
    );

    if (slotCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Position already filled' });
      return;
    }

    // Validate position slot matches formation
    const requiredSlots = getPositionSlotsForFormation(draft.formation);
    if (!requiredSlots.includes(position_slot)) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Invalid position for this formation' });
      return;
    }

    // Insert draft player
    await client.query(
      'INSERT INTO draft_players (draft_id, player_id, position_slot) VALUES ($1, $2, $3)',
      [draftId, player_id, position_slot]
    );

    // Check how many players have been selected
    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM draft_players WHERE draft_id = $1',
      [draftId]
    );

    const selectedCount = parseInt(countResult.rows[0].count);
    const draftComplete = selectedCount === 11;

    // Get remaining positions
    const selectedSlotsResult = await client.query(
      'SELECT position_slot FROM draft_players WHERE draft_id = $1',
      [draftId]
    );

    const selectedSlots = selectedSlotsResult.rows.map(row => row.position_slot);
    const remainingPositions = requiredSlots.filter(slot => !selectedSlots.includes(slot));

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      draft_complete: draftComplete,
      remaining_positions: remainingPositions,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Select player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function getDraftStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;

    // Get draft
    const draftResult = await pool.query(
      'SELECT id, user_id, formation, expires_at FROM drafts WHERE id = $1',
      [draftId]
    );

    if (draftResult.rows.length === 0) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const draft = draftResult.rows[0];

    if (draft.user_id !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    // Get selected players
    const playersResult = await pool.query(
      `SELECT
        dp.position_slot,
        p.id, p.name, p.position, p.event, p.ovr,
        p.pace, p.shooting, p.passing, p.dribbling, p.defending, p.physical,
        p.card_image_url
      FROM draft_players dp
      JOIN players p ON dp.player_id = p.id
      WHERE dp.draft_id = $1
      ORDER BY dp.position_slot`,
      [draftId]
    );

    const selectedPlayers = playersResult.rows.map(row => ({
      position_slot: row.position_slot,
      player: {
        id: row.id,
        name: row.name,
        position: row.position,
        event: row.event,
        ovr: row.ovr,
        pace: row.pace,
        shooting: row.shooting,
        passing: row.passing,
        dribbling: row.dribbling,
        defending: row.defending,
        physical: row.physical,
        card_image_url: row.card_image_url,
      },
    }));

    const requiredSlots = draft.formation ? getPositionSlotsForFormation(draft.formation) : [];
    const selectedSlots = selectedPlayers.map(p => p.position_slot);
    const remainingPositions = requiredSlots.filter(slot => !selectedSlots.includes(slot));
    const isComplete = draft.formation && remainingPositions.length === 0;

    res.status(200).json({
      draft_id: draft.id,
      formation: draft.formation,
      expires_at: draft.expires_at,
      selected_players: selectedPlayers,
      remaining_positions: remainingPositions,
      is_complete: isComplete,
    });
  } catch (error) {
    console.error('Get draft status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteDraft(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;

    // Check if draft exists and belongs to user
    const result = await pool.query(
      'SELECT id FROM drafts WHERE id = $1 AND user_id = $2',
      [draftId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    // Delete draft (cascade will delete draft_players)
    await pool.query('DELETE FROM drafts WHERE id = $1', [draftId]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
