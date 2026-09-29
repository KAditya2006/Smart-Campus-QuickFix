import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import User, { Role, VerificationStatus, AccountStatus } from '../src/models/User';
import Otp, { OtpPurpose } from '../src/models/Otp';

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await Otp.deleteMany({});
});

describe('Auth Endpoints', () => {
  
  describe('POST /api/auth/register', () => {
    it('should fail if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if identity card is missing', async () => {
      const res = await request(app).post('/api/auth/register').send({
        fullName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        collegeName: 'Test College',
      });
      // multer file is missing
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Identity card image is required');
    });

    // We skip the full success test for multipart/form-data with file buffer here 
    // to avoid complex buffer mocking in this simple suite, but we verify email duplication.
    
    it('should fail on duplicate email', async () => {
      await User.create({
        fullName: 'Existing',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        role: Role.CAMPUS_USER,
        emailVerificationStatus: false,
        identityVerificationStatus: VerificationStatus.PENDING_VERIFICATION,
        accountStatus: AccountStatus.ACTIVE,
      });

      const res = await request(app)
        .post('/api/auth/register')
        .field('fullName', 'Test User')
        .field('email', 'test@example.com')
        .field('phoneNumber', '1234567890')
        .field('collegeName', 'Test College')
        .attach('idCard', Buffer.from('fake image data'), 'test.png'); // Mock file

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Email is already registered');
    });
  });

  describe('POST /api/auth/login/send-otp', () => {
    it('should return 404 for unknown email', async () => {
      const res = await request(app).post('/api/auth/login/send-otp').send({
        email: 'unknown@example.com'
      });
      expect(res.status).toBe(404);
    });

    it('should successfully generate OTP for existing user', async () => {
      await User.create({
        fullName: 'Existing',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        role: Role.CAMPUS_USER,
        emailVerificationStatus: false,
        identityVerificationStatus: VerificationStatus.PENDING_VERIFICATION,
        accountStatus: AccountStatus.ACTIVE,
      });

      const res = await request(app).post('/api/auth/login/send-otp').send({
        email: 'test@example.com'
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const otpRecord = await Otp.findOne({ email: 'test@example.com' });
      expect(otpRecord).toBeDefined();
      expect(otpRecord?.purpose).toBe('LOGIN');
    });
  });

  describe('POST /api/auth/login/verify-otp', () => {
    it('should fail with invalid OTP', async () => {
       await User.create({
        fullName: 'Existing',
        email: 'test@example.com',
        phoneNumber: '1234567890',
        role: Role.CAMPUS_USER,
        emailVerificationStatus: false,
        identityVerificationStatus: VerificationStatus.PENDING_VERIFICATION,
        accountStatus: AccountStatus.ACTIVE,
      });

      await request(app).post('/api/auth/login/send-otp').send({ email: 'test@example.com' });
      
      const res = await request(app).post('/api/auth/login/verify-otp').send({
        email: 'test@example.com',
        otp: '000000'
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid OTP');
    });
  });
});
