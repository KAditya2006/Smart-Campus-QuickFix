import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { VerificationStatus } from './src/models/User';

dotenv.config();

const verifyUser = async (email: string) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickfix');
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }
    user.identityVerificationStatus = VerificationStatus.VERIFIED;
    await user.save();
    console.log(`Success! ${email} is now VERIFIED.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const email = process.argv[2];
verifyUser(email);
