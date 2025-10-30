import { Router } from 'express';
import { getAllManagers } from '../controllers/managerController';

const router = Router();

// GET /api/managers - Get all managers (public endpoint)
router.get('/', getAllManagers);

export default router;
