import { Router } from 'express';
import { getMyIssues, getIssueDetails, createIssue } from '../controllers/issueController';
import { requireAuth } from '../middleware/auth';
import { uploadEvidence } from '../middleware/upload';

const router = Router();

// Phase 3 & 4 endpoints (Campus User)
router.get('/my', requireAuth, getMyIssues);
router.post('/', requireAuth, uploadEvidence.single('photo'), createIssue);
router.get('/:issueId', requireAuth, getIssueDetails);

export default router;
