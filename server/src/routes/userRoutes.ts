import { Router } from 'express';
import { getDashboardSummary } from '../controllers/issueController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Dashboard summary for Campus User
router.get('/me/dashboard', requireAuth, getDashboardSummary);

export default router;
