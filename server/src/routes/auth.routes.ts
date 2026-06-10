import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateInputs } from '@/middlewares/validate.middleware';
import { resendOtpSchema, signinSchema, signupSchema, verifyOtpSchema } from '@/utils/validations';
import { authRoutes } from '@/constants/routes';

const router = Router();

export default router;
