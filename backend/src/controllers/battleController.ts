import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, TeamWithPlayers } from '../types';
import { generateRoomId } from '../utils/helpers';
import { getAllFormations, getPositionSlotsForFormation } from '../services/formationHelper';
import { randomElement } from '../utils/helpers';

async function getTeamWithPlayers(teamId: string): Promise<TeamWithPlayers | null> {
  const teamResult = await pool.query(
    'SELECT id, user_id, name, formation, playstyle FROM teams WHERE id = $1',
    [teamId]
  );

  if (teamResult.rows.length === 0) {
    return null;
  }

  const team = teamResult.rows[0];

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
    [teamId]
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
      created_at: new Date(),
    },
  }));

  return {
    id: team.id,
    user_id: team.user_id,
    name: team.name,
    formation: team.formation,
    playstyle: team.playstyle,
    players,
  };
}

async function generateAITeam(): Promise<TeamWithPlayers> {
  const formation = randomElement(getAllFormations());
  const positionSlots = getPositionSlotsForFormation(formation);

  const players = [];

  for (const slot of positionSlots) {
    const basePosition = slot.replace(/\d+$/, '');
    const playerResult = await pool.query(
      'SELECT * FROM players WHERE position = $1 ORDER BY RANDOM() LIMIT 1',
      [basePosition]
    );

    if (playerResult.rows.length > 0) {
      const p = playerResult.rows[0];
      players.push({
        position_slot: slot,
        player: {
          id: p.id,
          name: p.name,
          position: p.position,
          event: p.event,
          ovr: p.ovr,
          pace: p.pace,
          shooting: p.shooting,
          passing: p.passing,
          dribbling: p.dribbling,
          defending: p.defending,
          physical: p.physical,
          card_image_url: p.card_image_url,
          created_at: new Date(),
        },
      });
    }
  }

  return {
    name: 'AI Opponent',
    formation,
    playstyle: randomElement(['Tiki-Taka', 'Counter', 'Long Ball', 'Total Football']),
    players,
  };
}

export async function startTeamBattle(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { team_id } = req.body;

    // Verify team belongs to user
    const teamCheck = await pool.query(
      'SELECT id FROM teams WHERE id = $1 AND user_id = $2',
      [team_id, userId]
    );

    if (teamCheck.rows.length === 0) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Get home team (user's team)
    const homeTeam = await getTeamWithPlayers(team_id);

    if (!homeTeam) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    // Find random opponent team or generate AI
    const opponentResult = await pool.query(
      'SELECT id FROM teams WHERE user_id != $1 ORDER BY RANDOM() LIMIT 1',
      [userId]
    );

    let awayTeam: TeamWithPlayers;

    if (opponentResult.rows.length > 0) {
      const opponentTeamData = await getTeamWithPlayers(opponentResult.rows[0].id);
      awayTeam = opponentTeamData!;
    } else {
      awayTeam = await generateAITeam();
    }

    // Generate room ID
    const roomId = generateRoomId();

    // Create match record
    const matchResult = await pool.query(
      `INSERT INTO matches (match_type, home_user_id, away_user_id, home_team_id, away_team_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['TEAM_BATTLE', userId, awayTeam.user_id || null, team_id, awayTeam.id || null]
    );

    const matchId = matchResult.rows[0].id;

    res.status(200).json({
      match: {
        id: matchId,
        room_id: roomId,
        home_team: homeTeam,
        away_team: awayTeam,
        match_type: 'TEAM_BATTLE',
      },
    });
  } catch (error) {
    console.error('Start team battle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDraftTeamWithPlayers(draftId: string): Promise<TeamWithPlayers | null> {
  const draftResult = await pool.query(
    'SELECT id, user_id, formation FROM drafts WHERE id = $1',
    [draftId]
  );

  if (draftResult.rows.length === 0) {
    return null;
  }

  const draft = draftResult.rows[0];

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
      created_at: new Date(),
    },
  }));

  return {
    id: draft.id,
    user_id: draft.user_id,
    name: 'Draft Team',
    formation: draft.formation,
    playstyle: 'Balanced',
    players,
  };
}

export async function startDraftBattle(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const draftId = req.params.draft_id;

    // Check draft belongs to user and is complete
    const draftCheck = await pool.query(
      'SELECT id, formation, expires_at FROM drafts WHERE id = $1 AND user_id = $2',
      [draftId, userId]
    );

    if (draftCheck.rows.length === 0) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    const draft = draftCheck.rows[0];

    if (new Date(draft.expires_at) < new Date()) {
      res.status(410).json({ error: 'Draft has expired' });
      return;
    }

    // Check if draft is complete (11 players)
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM draft_players WHERE draft_id = $1',
      [draftId]
    );

    if (parseInt(countResult.rows[0].count) !== 11) {
      res.status(400).json({ error: 'Draft team is not complete yet' });
      return;
    }

    // Get home draft team
    const homeTeam = await getDraftTeamWithPlayers(draftId);

    if (!homeTeam) {
      res.status(404).json({ error: 'Draft not found' });
      return;
    }

    // Try to find another complete draft or generate AI
    const opponentDraftResult = await pool.query(
      `SELECT d.id FROM drafts d
       WHERE d.user_id != $1
       AND d.expires_at > NOW()
       AND (SELECT COUNT(*) FROM draft_players WHERE draft_id = d.id) = 11
       ORDER BY RANDOM() LIMIT 1`,
      [userId]
    );

    let awayTeam: TeamWithPlayers;

    if (opponentDraftResult.rows.length > 0) {
      const opponentDraftData = await getDraftTeamWithPlayers(opponentDraftResult.rows[0].id);
      awayTeam = opponentDraftData!;
    } else {
      awayTeam = await generateAITeam();
    }

    // Generate room ID
    const roomId = generateRoomId();

    // Create match record
    const matchResult = await pool.query(
      `INSERT INTO matches (match_type, home_user_id, away_user_id, home_team_id, away_team_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ['DRAFT_BATTLE', userId, awayTeam.user_id || null, draftId, awayTeam.id || null]
    );

    const matchId = matchResult.rows[0].id;

    res.status(200).json({
      match: {
        id: matchId,
        room_id: roomId,
        home_team: homeTeam,
        away_team: awayTeam,
        match_type: 'DRAFT_BATTLE',
      },
    });
  } catch (error) {
    console.error('Start draft battle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
