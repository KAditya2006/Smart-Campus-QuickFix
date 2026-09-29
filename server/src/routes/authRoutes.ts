import { Router } from 'express';
import { register, verifyRegistrationOtp, sendLoginOtp, verifyLoginOtp, logout, getProfile } from '../controllers/authController';
import { uploadIdCard } from '../middleware/upload';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', uploadIdCard.single('idCard'), register);
router.post('/send-otp', sendLoginOtp); // Generic send OTP could map here, but let's be explicit
router.post('/verify-otp', verifyRegistrationOtp);

router.post('/login/send-otp', sendLoginOtp);
router.post('/login/verify-otp', verifyLoginOtp);

router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);

export default router;
