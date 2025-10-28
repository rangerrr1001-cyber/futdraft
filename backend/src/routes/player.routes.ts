import { Router } from 'express';
import { getMyPlayers } from '../controllers/playerController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateToken, getMyPlayers);

export default router;
