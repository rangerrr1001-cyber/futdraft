import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import spinRoutes from './routes/spin.routes';
import playerRoutes from './routes/player.routes';
import teamRoutes from './routes/team.routes';
import draftRoutes from './routes/draft.routes';
import battleRoutes from './routes/battle.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FUT Draft API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/spin', spinRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/draft', draftRoutes);
app.use('/api/battles', battleRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
