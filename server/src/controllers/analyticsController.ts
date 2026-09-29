import { Response } from 'express';
import Issue from '../models/Issue';
import { AuthRequest } from '../middleware/auth';

import mongoose from 'mongoose';

export const getUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Group by status
    const statusAggregation = await Issue.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Group by category
    const categoryAggregation = await Issue.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrend = await Issue.aggregate([
      { $match: { userId: userObjectId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        byStatus: statusAggregation,
        byCategory: categoryAggregation,
        monthlyTrend,
      }
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAuthorityAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    // Group by status
    const statusAggregation = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Group by category
    const categoryAggregation = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Group by priority
    const priorityAggregation = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrend = await Issue.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        byStatus: statusAggregation,
        byCategory: categoryAggregation,
        byPriority: priorityAggregation,
        monthlyTrend,
      }
    });
  } catch (error) {
    console.error('Error fetching authority analytics:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
