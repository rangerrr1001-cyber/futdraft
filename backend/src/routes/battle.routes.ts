import { Router } from 'express';
import { startTeamBattle, startDraftBattle } from '../controllers/battleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/start', authenticateToken, startTeamBattle);
router.post('/draft/:draft_id/battle', authenticateToken, startDraftBattle);

export default router;
