import { Router } from 'express';
import { checkSpinAvailability, executeSpin, getSpinOptions } from '../controllers/spinController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/check', authenticateToken, checkSpinAvailability);
router.post('/execute', authenticateToken, executeSpin);
router.get('/options', getSpinOptions); // Public endpoint

export default router;
