import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User, { Role, VerificationStatus, AccountStatus } from '../models/User';
import Otp, { OtpPurpose } from '../models/Otp';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otp';
import { verificationService } from '../services/identityVerificationService';

// Zod schemas for validation
const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  collegeName: z.string().min(1, 'College name is required'),
});

const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

import { sendEmail } from '../services/emailService';

const sendOtpEmail = async (email: string, otp: string) => {
  const subject = 'Your Smart Campus QuickFix OTP';
  const text = `Your One-Time Password (OTP) is: ${otp}\n\nIt is valid for a short time. Please do not share this with anyone.`;
  await sendEmail(email, subject, text);
};

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    }
    const { fullName, email, phoneNumber, collegeName } = parsed.data;

    // 2. Validate file
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Identity card image is required' });
    }

    // 3. Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email is already registered' });
    }

    // 4. Create user
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      collegeName,
      idCardUrl: req.file.path,
      role: Role.CAMPUS_USER,
      emailVerificationStatus: false,
      identityVerificationStatus: VerificationStatus.PENDING_VERIFICATION,
      accountStatus: AccountStatus.ACTIVE,
    });
    await newUser.save();

    // Trigger identity verification in the background
    verificationService.processVerification(newUser._id.toString()).catch((err: any) => {
      console.error('Background verification error:', err);
    });

    // 5. Generate and send OTP for registration
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    
    // Expire in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await Otp.create({
      email,
      otpHash,
      purpose: OtpPurpose.REGISTRATION,
      expiresAt,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Generated REGISTRATION OTP for ${email}: ${otp}`);
    }
    await sendOtpEmail(email, otp);

    return res.status(201).json({ success: true, message: 'Registration successful. OTP sent to email.' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error?.message || 'Unknown error' });
  }
};

export const verifyRegistrationOtp = async (req: Request, res: Response) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    }
    const { email, otp } = parsed.data;

    const otpRecord = await Otp.findOne({
      email,
      purpose: OtpPurpose.REGISTRATION,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    if (otpRecord.attemptCount >= 3) {
      return res.status(429).json({ success: false, error: 'Too many failed attempts. Request a new OTP.' });
    }

    const isValid = await verifyOtpHash(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attemptCount += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Mark used
    otpRecord.used = true;
    await otpRecord.save();

    // Update user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.emailVerificationStatus = true;
    await user.save();

    // Issue JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, emailVerificationStatus: user.emailVerificationStatus },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const sendLoginOtp = async (req: Request, res: Response) => {
  try {
    const parsed = sendOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    }
    const { email } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      // Return a generic success to prevent email enumeration, but since this is a known challenge, we can return 404 for clarity.
      return res.status(404).json({ success: false, error: 'No account found with this email' });
    }

    if (user.accountStatus === AccountStatus.SUSPENDED) {
      return res.status(403).json({ success: false, error: 'Account is suspended' });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    
    await Otp.create({
      email,
      otpHash,
      purpose: OtpPurpose.LOGIN,
      expiresAt,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] Generated LOGIN OTP for ${email}: ${otp}`);
    }
    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error', details: error?.message || 'Unknown error' });
  }
};

export const verifyLoginOtp = async (req: Request, res: Response) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.issues[0].message });
    }
    const { email, otp } = parsed.data;

    const otpRecord = await Otp.findOne({
      email,
      purpose: OtpPurpose.LOGIN,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    if (otpRecord.attemptCount >= 3) {
      return res.status(429).json({ success: false, error: 'Too many failed attempts. Request a new OTP.' });
    }

    const isValid = await verifyOtpHash(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attemptCount += 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, emailVerificationStatus: user.emailVerificationStatus },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Since we use JWTs, real logout is typically handled client-side by deleting the token.
  // We can just return success here.
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
