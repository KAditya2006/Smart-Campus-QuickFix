import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateOtp = (): string => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + crypto.randomInt(900000)).toString();
};

export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const verifyOtpHash = async (otp: string, hashedOtp: string): Promise<boolean> => {
  return bcrypt.compare(otp, hashedOtp);
};
