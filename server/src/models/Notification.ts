import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
  ISSUE_STATUS_CHANGED = 'ISSUE_STATUS_CHANGED',
  ISSUE_PRIORITY_CHANGED = 'ISSUE_PRIORITY_CHANGED',
  ISSUE_UPDATED = 'ISSUE_UPDATED',
  NEW_ISSUE_REPORTED = 'NEW_ISSUE_REPORTED',
}

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  issueId: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    issueId: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
