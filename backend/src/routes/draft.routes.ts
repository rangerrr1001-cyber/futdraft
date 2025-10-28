import { Router } from 'express';
import {
  startDraft,
  selectFormation,
  getPlayersForPosition,
  selectPlayer,
  getDraftStatus,
  deleteDraft
} from '../controllers/draftController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/start', authenticateToken, startDraft);
router.post('/:draft_id/select-formation', authenticateToken, selectFormation);
router.get('/:draft_id/players/:position_slot', authenticateToken, getPlayersForPosition);
router.post('/:draft_id/select-player', authenticateToken, selectPlayer);
router.get('/:draft_id', authenticateToken, getDraftStatus);
router.delete('/:draft_id', authenticateToken, deleteDraft);

export default router;
