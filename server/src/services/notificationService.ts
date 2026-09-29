import Notification, { NotificationType } from '../models/Notification';
import { IIssue, IssueStatus } from '../models/Issue';
import mongoose from 'mongoose';

export const createStatusNotification = async (issue: IIssue, previousStatus: IssueStatus) => {
  // Prevent duplicate notification logic if needed (e.g. status didn't actually change)
  if (issue.status === previousStatus) return;

  let title = 'Issue Status Updated';
  let message = `Your issue #${issue.issueId} has been updated.`;

  if (issue.status === IssueStatus.IN_PROGRESS) {
    message = `Your issue #${issue.issueId} is now in progress.`;
  } else if (issue.status === IssueStatus.RESOLVED) {
    message = `Your issue #${issue.issueId} has been resolved.`;
  } else if (issue.status === IssueStatus.REJECTED) {
    message = `Your issue #${issue.issueId} has been rejected.`;
  }

  await Notification.create({
    recipientId: issue.userId,
    type: NotificationType.ISSUE_STATUS_CHANGED,
    title,
    message,
    issueId: issue._id,
  });
};

export const createUpdateNotification = async (issue: IIssue, remark: string) => {
  if (!remark) return;

  const title = 'New Update on Your Issue';
  const message = `There is a new update on your issue #${issue.issueId}: "${remark}"`;

  await Notification.create({
    recipientId: issue.userId,
    type: NotificationType.ISSUE_UPDATED,
    title,
    message,
    issueId: issue._id,
  });
};

export const createPriorityNotification = async (issue: IIssue) => {
  const title = 'Issue Priority Updated';
  const message = `The priority of your issue #${issue.issueId} has been set to ${issue.priority}.`;

  await Notification.create({
    recipientId: issue.userId,
    type: NotificationType.ISSUE_PRIORITY_CHANGED,
    title,
    message,
    issueId: issue._id,
  });
};

export const createNewIssueNotification = async (issue: IIssue, authorityIds: mongoose.Types.ObjectId[]) => {
  const title = 'New Issue Reported';
  const message = `A new issue #${issue.issueId} (${issue.category}) has been reported at ${issue.location}.`;

  const notifications = authorityIds.map(authorityId => ({
    recipientId: authorityId,
    type: NotificationType.NEW_ISSUE_REPORTED,
    title,
    message,
    issueId: issue._id,
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
};
