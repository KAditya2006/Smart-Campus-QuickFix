import { Request, Response } from 'express';
import Issue, { IssueStatus, IssuePriority } from '../models/Issue';
import { AuthRequest } from '../middleware/auth';
import { validateTransition } from '../services/statusTransitionService';
import { createStatusNotification, createUpdateNotification, createPriorityNotification } from '../services/notificationService';
import User from '../models/User';
import { sendEmail } from '../services/emailService';

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const total = await Issue.countDocuments();
    const submitted = await Issue.countDocuments({ status: IssueStatus.SUBMITTED });
    const inProgress = await Issue.countDocuments({ status: IssueStatus.IN_PROGRESS });
    const resolved = await Issue.countDocuments({ status: IssueStatus.RESOLVED });

    // Recent 5 issues
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('issueId title category location status priority createdAt');

    return res.status(200).json({
      success: true,
      summary: { total, submitted, inProgress, resolved },
      recentIssues,
    });
  } catch (error) {
    console.error('Error fetching authority dashboard:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { status, priority, search } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { issueId: { $regex: search as string, $options: 'i' } },
        { title: { $regex: search as string, $options: 'i' } },
        { category: { $regex: search as string, $options: 'i' } },
        { location: { $regex: search as string, $options: 'i' } },
      ];
    }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 }) // Pagination can be added using limit/skip if needed
      .select('issueId title category location status priority createdAt');

    return res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error('Error fetching all issues:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getIssueDetails = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.params;
    // Populate reporter information minimally
    const issue = await Issue.findById(issueId)
      .populate('userId', 'fullName email phone college'); // Exclude sensitive like idCardUrl

    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    return res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error('Error fetching authority issue details:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateIssueStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { issueId } = req.params;
    const { status, remark } = req.body;
    const authorityId = req.user?.id;

    if (!Object.values(IssueStatus).includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    // Validate transition
    if (!validateTransition(issue.status, status)) {
      return res.status(400).json({ success: false, error: 'Invalid status transition' });
    }

    const previousStatus = issue.status;
    issue.status = status;
    issue.statusHistory.push({
      status,
      timestamp: new Date(),
      changedBy: authorityId as any,
      remark: remark || undefined,
    });

    await issue.save();

    // Trigger Notifications
    await createStatusNotification(issue, previousStatus);
    if (remark) {
      await createUpdateNotification(issue, remark);
    }

    // Send Email Notification
    try {
      const user = await User.findById(issue.userId);
      if (user && user.email) {
        const subject = `Update on Issue ${issue.issueId}: ${issue.status}`;
        let text = `Hello ${user.fullName},\n\nYour issue "${issue.title}" (${issue.issueId}) has been updated.\n\nNew Status: ${issue.status}\n`;
        if (remark) {
          text += `Remark from Authority: ${remark}\n`;
        }
        text += `\nThank you for using Smart Campus QuickFix.`;
        
        // We use .catch on the promise to prevent holding up the HTTP response
        sendEmail(user.email, subject, text).catch(e => console.error('Failed to send status update email', e));
      }
    } catch (emailError) {
      console.error('Failed to prepare status update email', emailError);
    }

    return res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateIssuePriority = async (req: AuthRequest, res: Response) => {
  try {
    const { issueId } = req.params;
    const { priority } = req.body;

    if (!Object.values(IssuePriority).includes(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority value' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    const previousPriority = issue.priority;
    issue.priority = priority;
    await issue.save();

    if (previousPriority !== priority) {
      await createPriorityNotification(issue);
      
      // Send Email Notification
      try {
        const user = await User.findById(issue.userId);
        if (user && user.email) {
          const subject = `Priority Update on Issue ${issue.issueId}: ${issue.priority}`;
          const text = `Hello ${user.fullName},\n\nThe priority of your issue "${issue.title}" (${issue.issueId}) has been updated by the authority.\n\nNew Priority: ${issue.priority}\n\nThank you for using Smart Campus QuickFix.`;
          sendEmail(user.email, subject, text).catch(e => console.error('Failed to send priority update email', e));
        }
      } catch (emailError) {
        console.error('Failed to prepare priority update email', emailError);
      }
    }

    return res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error('Error updating issue priority:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
