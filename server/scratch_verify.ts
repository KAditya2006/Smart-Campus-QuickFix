import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const updateDemoUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
    // We need to use the actual model or just raw collection
    const db = mongoose.connection.db;
    const usersCollection = db?.collection('users');
    
    if (usersCollection) {
       const result = await usersCollection.updateMany(
         { identityVerificationStatus: 'MANUAL_REVIEW' },
         { $set: { identityVerificationStatus: 'VERIFIED' } }
       );
       console.log(`Updated ${result.modifiedCount} users to VERIFIED.`);
    }
    
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

updateDemoUser();
