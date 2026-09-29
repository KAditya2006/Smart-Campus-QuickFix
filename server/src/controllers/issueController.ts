import { Request, Response } from 'express';
import Issue, { IssueStatus, IIssue } from '../models/Issue';
import User from '../models/User';
import { sendEmail } from '../services/emailService';
import { createNewIssueNotification } from '../services/notificationService';
import mongoose from 'mongoose';

// GET /api/users/me/dashboard
export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // Aggregate counts
    const issues = await Issue.find({ userId });
    
    const summary = {
      total: issues.length,
      submitted: issues.filter(i => i.status === 'SUBMITTED').length,
      inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
      resolved: issues.filter(i => i.status === 'RESOLVED').length,
    };

    // Get 3 most recent issues
    const recentIssues = await Issue.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({ success: true, summary, recentIssues });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/issues/my
export const getMyIssues = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.query; // optional filter

    const query: any = { userId };
    if (status) {
      query.status = status;
    }

    const issues = await Issue.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error('Error fetching my issues:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// GET /api/issues/:issueId
export const getIssueDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    // Ownership check
    if (issue.userId.toString() !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden. You can only access your own issues.' });
    }

    return res.status(200).json({ success: true, issue });
  } catch (error) {
    console.error('Error fetching issue details:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// POST /api/issues
export const createIssue = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const userStatus = (req as any).user.identityVerificationStatus;

    if (userRole !== 'CAMPUS_USER' || userStatus !== 'VERIFIED') {
      return res.status(403).json({ success: false, error: 'Only verified campus users can report issues' });
    }

    const { category, description, location } = req.body;
    
    if (!category || !description || !location) {
      return res.status(400).json({ success: false, error: 'Category, description, and location are required' });
    }

    // Check for duplicates
    const duplicateIssue = await Issue.findOne({
      category,
      location,
      status: { $in: [IssueStatus.SUBMITTED, IssueStatus.IN_PROGRESS] }
    }) as any;

    if (duplicateIssue) {
      // Send an in-app notification to the user about the duplicate
      await mongoose.model('Notification').create({
        recipientId: userId,
        type: 'SYSTEM', // or a custom type if defined
        title: 'Duplicate Issue Detected',
        message: `Your complaint for ${category} at ${location} is already registered. Current status: ${duplicateIssue.status}`,
        issueId: duplicateIssue._id
      });

      return res.status(409).json({ 
        success: false, 
        error: `Duplicate Issue: This complaint is already registered. Current status: ${duplicateIssue.status}`
      });
    }

    const file = req.file;
    let photoUrl = undefined;

    if (file) {
      photoUrl = `uploads/${file.filename}`;
    }

    // Generate unique Issue ID SQF-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const issueId = `SQF-2026-${randomSuffix}`;

    const combinedText = `${category} ${description}`.toLowerCase();
    let priority = 'LOW';
    if (combinedText.includes('fire') || combinedText.includes('short circuit') || combinedText.includes('power') || combinedText.includes('urgent') || combinedText.includes('emergency') || combinedText.includes('water') || combinedText.includes('hazard') || combinedText.includes('leak') || combinedText.includes('broken')) {
      priority = 'HIGH';
    } else if (combinedText.includes('plumbing') || combinedText.includes('ac') || combinedText.includes('fan') || combinedText.includes('internet') || combinedText.includes('network') || combinedText.includes('classroom') || combinedText.includes('cleaning')) {
      priority = 'MEDIUM';
    }

    const newIssue = new Issue({
      issueId,
      userId,
      title: category, // Using category as title for simplicity
      category,
      description,
      location,
      photoUrl,
      priority,
      status: 'SUBMITTED',
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: new Date(),
          changedBy: userId,
          remark: 'Issue reported'
        }
      ]
    });

    await newIssue.save();

    // Trigger Notifications for Authority
    try {
      const authorities = await User.find({ role: 'AUTHORITY' as any }).select('_id');
      const authorityIds = authorities.map(a => (a as any)._id as mongoose.Types.ObjectId);
      await createNewIssueNotification(newIssue, authorityIds);
    } catch (notifError) {
      console.error('Failed to create notification for authorities', notifError);
    }

    // Send Email Notification
    try {
      const user = await User.findById(userId);
      if (user && user.email) {
        const subject = `Issue Reported: ${newIssue.issueId}`;
        const text = `Hello ${user.fullName},\n\nWe have successfully received your issue report.\n\nID: ${newIssue.issueId}\nCategory: ${newIssue.category}\nLocation: ${newIssue.location}\n\nOur maintenance team will review it shortly. You can track the status in the Smart Campus QuickFix app.\n\nThank you!`;
        sendEmail(user.email, subject, text).catch(e => console.error('Failed to send issue creation email', e));
      }
    } catch (emailError) {
      console.error('Failed to prepare issue creation email', emailError);
    }

    return res.status(201).json({ success: true, issue: newIssue });

  } catch (error) {
    console.error('Error creating issue:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
