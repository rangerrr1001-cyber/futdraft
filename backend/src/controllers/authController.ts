import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Validation: username format
    if (!username || typeof username !== 'string') {
      res.status(400).json({ error: 'Username is required' });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      res.status(400).json({ error: 'Username must be 3-20 characters (letters, numbers, underscore)' });
      return;
    }

    // Validation: password length
    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: 'Username already taken' });
      return;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, password_hash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Find user
    const result = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
