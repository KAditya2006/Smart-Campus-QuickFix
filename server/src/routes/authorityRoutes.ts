import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { 
  getDashboardSummary, 
  getAllIssues, 
  getIssueDetails,
  updateIssueStatus,
  updateIssuePriority 
} from '../controllers/authorityController';

const router = Router();

// Apply authentication and AUTHORITY role check to all routes in this router
router.use(requireAuth);
router.use(requireRole('AUTHORITY'));

router.get('/dashboard', getDashboardSummary);
router.get('/issues', getAllIssues);
router.get('/issues/:issueId', getIssueDetails);
router.patch('/issues/:issueId/status', updateIssueStatus);
router.patch('/issues/:issueId/priority', updateIssuePriority);

export default router;
