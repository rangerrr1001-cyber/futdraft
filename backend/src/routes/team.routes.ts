import { Router } from 'express';
import { getAllTeams, createTeam, updateTeam, deleteTeam } from '../controllers/teamController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getAllTeams);
router.post('/', authenticateToken, createTeam);
router.put('/:id', authenticateToken, updateTeam);
router.delete('/:id', authenticateToken, deleteTeam);

export default router;
