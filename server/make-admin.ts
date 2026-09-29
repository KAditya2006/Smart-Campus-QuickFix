import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { Role } from './src/models/User';

dotenv.config();

const makeAdmin = async (email: string) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickfix');
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }
    user.role = Role.AUTHORITY;
    await user.save();
    console.log(`Success! ${email} is now an ADMIN (AUTHORITY).`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email. Usage: npx ts-node make-admin.ts <email>');
  process.exit(1);
}

makeAdmin(email);
