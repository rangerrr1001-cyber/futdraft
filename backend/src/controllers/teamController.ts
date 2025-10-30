import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, Playstyle } from '../types';
import { isValidFormation, validatePositionSlots, getPositionSlotsForFormation, parsePositionFromSlot } from '../services/formationHelper';

const VALID_PLAYSTYLES: Playstyle[] = ['Tiki-Taka', 'Counter', 'Long Ball', 'Total Football'];

export async function getAllTeams(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    // Get all teams for this user
    const teamsResult = await pool.query(
      'SELECT id, name, formation, playstyle, manager_id, created_at FROM teams WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const teams = [];

    for (const team of teamsResult.rows) {
      // Get players for this team
      const playersResult = await pool.query(
        `SELECT
          tp.position_slot,
          p.id, p.name, p.position, p.event, p.ovr,
          p.pace, p.shooting, p.passing, p.dribbling, p.defending, p.physical,
          p.card_image_url
        FROM team_players tp
        JOIN user_players up ON tp.user_player_id = up.id
        JOIN players p ON up.player_id = p.id
        WHERE tp.team_id = $1
        ORDER BY tp.position_slot`,
        [team.id]
      );

      const players = playersResult.rows.map(row => ({
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

      teams.push({
        id: team.id,
        name: team.name,
        formation: team.formation,
        playstyle: team.playstyle,
        created_at: team.created_at,
        players,
      });
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error('Get all teams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createTeam(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    const userId = req.userId;
    const { name, formation, manager_id, players } = req.body;

    // Validation: name
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 50) {
      res.status(400).json({ error: 'Team name must be 3-50 characters' });
      return;
    }

    // Validation: formation
    if (!isValidFormation(formation)) {
      res.status(400).json({ error: 'Invalid formation' });
      return;
    }

    // Validation: manager_id (required)
    if (!manager_id || typeof manager_id !== 'number') {
      res.status(400).json({ error: 'Manager ID is required' });
      return;
    }

    // Verify manager exists and get playstyle
    const managerResult = await client.query(
      'SELECT id, playstyle FROM managers WHERE id = $1',
      [manager_id]
    );

    if (managerResult.rows.length === 0) {
      res.status(400).json({ error: 'Invalid manager ID' });
      return;
    }

    const playstyle = managerResult.rows[0].playstyle;

    // Validation: players array
    if (!Array.isArray(players) || players.length !== 11) {
      res.status(400).json({ error: 'Team must have exactly 11 players' });
      return;
    }

    // Validation: position slots match formation
    const providedSlots = players.map(p => p.position_slot);
    if (!validatePositionSlots(formation, providedSlots)) {
      res.status(400).json({ error: "Position slots don't match formation" });
      return;
    }

    // Check for duplicate players in same team
    const userPlayerIds = players.map(p => p.user_player_id);
    const uniqueIds = new Set(userPlayerIds);
    if (uniqueIds.size !== userPlayerIds.length) {
      res.status(400).json({ error: 'Cannot use same player multiple times' });
      return;
    }

    await client.query('BEGIN');

    // Verify all user_player_ids belong to the user
    const ownershipResult = await client.query(
      'SELECT id FROM user_players WHERE id = ANY($1) AND user_id = $2',
      [userPlayerIds, userId]
    );

    if (ownershipResult.rows.length !== 11) {
      await client.query('ROLLBACK');
      res.status(403).json({ error: "You don't own one or more selected players" });
      return;
    }

    // Create team
    const teamResult = await client.query(
      'INSERT INTO teams (user_id, name, formation, playstyle, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, formation, playstyle, manager_id, created_at',
      [userId, name, formation, playstyle, manager_id]
    );

    const team = teamResult.rows[0];

    // Insert team players
    for (const player of players) {
      await client.query(
        'INSERT INTO team_players (team_id, user_player_id, position_slot) VALUES ($1, $2, $3)',
        [team.id, player.user_player_id, player.position_slot]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      team: {
        id: team.id,
        name: team.name,
        formation: team.formation,
        playstyle: team.playstyle,
        manager_id: team.manager_id,
        created_at: team.created_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function updateTeam(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();

  try {
    const userId = req.userId;
    const teamId = req.params.id;
    const { name, formation, playstyle, players } = req.body;

    // Check if team exists and belongs to user
    const teamCheck = await client.query(
      'SELECT id FROM teams WHERE id = $1 AND user_id = $2',
      [teamId, userId]
    );

    if (teamCheck.rows.length === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Same validations as create
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 50) {
      res.status(400).json({ error: 'Team name must be 3-50 characters' });
      return;
    }

    if (!isValidFormation(formation)) {
      res.status(400).json({ error: 'Invalid formation' });
      return;
    }

    if (!VALID_PLAYSTYLES.includes(playstyle)) {
      res.status(400).json({ error: 'Invalid playstyle' });
      return;
    }

    if (!Array.isArray(players) || players.length !== 11) {
      res.status(400).json({ error: 'Team must have exactly 11 players' });
      return;
    }

    const providedSlots = players.map(p => p.position_slot);
    if (!validatePositionSlots(formation, providedSlots)) {
      res.status(400).json({ error: "Position slots don't match formation" });
      return;
    }

    const userPlayerIds = players.map(p => p.user_player_id);
    const uniqueIds = new Set(userPlayerIds);
    if (uniqueIds.size !== userPlayerIds.length) {
      res.status(400).json({ error: 'Cannot use same player multiple times' });
      return;
    }

    await client.query('BEGIN');

    // Verify ownership
    const ownershipResult = await client.query(
      'SELECT id FROM user_players WHERE id = ANY($1) AND user_id = $2',
      [userPlayerIds, userId]
    );

    if (ownershipResult.rows.length !== 11) {
      await client.query('ROLLBACK');
      res.status(403).json({ error: "You don't own one or more selected players" });
      return;
    }

    // Update team
    await client.query(
      'UPDATE teams SET name = $1, formation = $2, playstyle = $3, updated_at = NOW() WHERE id = $4',
      [name, formation, playstyle, teamId]
    );

    // Delete old team_players
    await client.query('DELETE FROM team_players WHERE team_id = $1', [teamId]);

    // Insert new team_players
    for (const player of players) {
      await client.query(
        'INSERT INTO team_players (team_id, user_player_id, position_slot) VALUES ($1, $2, $3)',
        [teamId, player.user_player_id, player.position_slot]
      );
    }

    await client.query('COMMIT');

    res.status(200).json({
      team: {
        id: teamId,
        name,
        formation,
        playstyle,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

export async function deleteTeam(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const teamId = req.params.id;

    // Check if team exists and belongs to user
    const result = await pool.query(
      'SELECT id FROM teams WHERE id = $1 AND user_id = $2',
      [teamId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Delete team (cascade will delete team_players)
    await pool.query('DELETE FROM teams WHERE id = $1', [teamId]);

    res.status(204).send();
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
