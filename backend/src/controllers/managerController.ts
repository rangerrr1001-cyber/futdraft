import { Request, Response } from 'express';
import pool from '../config/database';
import { Manager } from '../types';

/**
 * GET /api/managers
 * Get all managers (public endpoint)
 * Returns array of managers with id, name, playstyle, and image_url
 */
export async function getAllManagers(req: Request, res: Response): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT id, name, playstyle, image_url, created_at
       FROM managers
       ORDER BY id ASC`
    );

    const managers: Manager[] = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      playstyle: row.playstyle,
      image_url: row.image_url,
      created_at: row.created_at,
    }));

    res.status(200).json(managers);
  } catch (error) {
    console.error('Get managers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
