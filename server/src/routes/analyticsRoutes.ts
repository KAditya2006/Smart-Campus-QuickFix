import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getUserAnalytics, getAuthorityAnalytics } from '../controllers/analyticsController';

const router = express.Router();

router.get('/user', requireAuth, getUserAnalytics);
router.get('/authority', requireAuth, requireRole('AUTHORITY'), getAuthorityAnalytics);

export default router;
