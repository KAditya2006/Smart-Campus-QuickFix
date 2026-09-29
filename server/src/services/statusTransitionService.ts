import { IssueStatus } from '../models/Issue';

const ALLOWED_TRANSITIONS: Record<IssueStatus, IssueStatus[]> = {
  [IssueStatus.SUBMITTED]: [IssueStatus.IN_PROGRESS, IssueStatus.REJECTED],
  [IssueStatus.IN_PROGRESS]: [IssueStatus.RESOLVED, IssueStatus.REJECTED],
  [IssueStatus.RESOLVED]: [], // Terminal state
  [IssueStatus.REJECTED]: [], // Terminal state
};

export const validateTransition = (currentStatus: IssueStatus, nextStatus: IssueStatus): boolean => {
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowedNext) return false;
  return allowedNext.includes(nextStatus);
};
