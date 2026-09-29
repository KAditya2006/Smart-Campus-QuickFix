import mongoose, { Document, Schema } from 'mongoose';

export enum Role {
  CAMPUS_USER = 'CAMPUS_USER',
  AUTHORITY = 'AUTHORITY',
}

export enum VerificationStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface IVerificationDetails {
  status: VerificationStatus;
  nameMatch: boolean;
  collegeMatch: boolean;
  documentNameExtracted?: string | null;
  documentCollegeExtracted?: string | null;
  reason: string;
  verifiedAt?: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  collegeName?: string;
  idCardUrl?: string;
  role: Role;
  emailVerificationStatus: boolean;
  identityVerificationStatus: VerificationStatus;
  verificationDetails?: IVerificationDetails;
  accountStatus: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true },
    collegeName: { type: String, required: false },
    idCardUrl: { type: String, required: false },
    role: { type: String, enum: Object.values(Role), default: Role.CAMPUS_USER },
    emailVerificationStatus: { type: Boolean, default: false },
    identityVerificationStatus: { 
      type: String, 
      enum: Object.values(VerificationStatus), 
      default: VerificationStatus.PENDING_VERIFICATION 
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE
    },
    verificationDetails: {
      status: { type: String, enum: Object.values(VerificationStatus) },
      nameMatch: { type: Boolean },
      collegeMatch: { type: Boolean },
      documentNameExtracted: { type: String },
      documentCollegeExtracted: { type: String },
      reason: { type: String },
      verifiedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
