import mongoose, { Document, Schema } from 'mongoose';

export enum IssueStatus {
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface IStatusHistory {
  status: IssueStatus;
  timestamp: Date;
  changedBy: mongoose.Types.ObjectId; // User ID of the changer
  remark?: string;
}

export interface IIssue extends Document {
  issueId: string;
  userId: mongoose.Types.ObjectId;
  title: string; // or category
  category: string;
  description: string;
  location: string;
  photoUrl?: string;
  status: IssueStatus;
  statusHistory: IStatusHistory[];
  priority?: IssuePriority;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    issueId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    photoUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(IssueStatus),
      default: IssueStatus.SUBMITTED,
    },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(IssueStatus), required: true },
        timestamp: { type: Date, default: Date.now },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        remark: { type: String },
      }
    ],
    priority: {
      type: String,
      enum: Object.values(IssuePriority),
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IIssue>('Issue', issueSchema);
