import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';

export async function getMyPlayers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    // Query user's players with full player details
    const result = await pool.query(
      `SELECT
        p.id,
        p.name,
        p.position,
        p.event,
        p.ovr,
        p.pace,
        p.shooting,
        p.passing,
        p.dribbling,
        p.defending,
        p.physical,
        p.card_image_url,
        up.acquired_at
      FROM user_players up
      JOIN players p ON up.player_id = p.id
      WHERE up.user_id = $1
      ORDER BY up.acquired_at DESC`,
      [userId]
    );

    const players = result.rows.map(row => ({
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
      acquired_at: row.acquired_at,
    }));

    res.status(200).json({ players });
  } catch (error) {
    console.error('Get my players error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
