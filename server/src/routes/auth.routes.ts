import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateInputs } from '@/middlewares/validate.middleware';
import { resendOtpSchema, signinSchema, signupSchema, verifyOtpSchema } from '@/utils/validations';
import { authRoutes } from '@/constants/routes';

const router = Router();

router.post(authRoutes.signup, validateInputs(signupSchema), authController.signup);
router.post(authRoutes.signin, validateInputs(signinSchema), authController.signin);
router.post(authRoutes.google, authController.googleAuth);
router.post(authRoutes.verifyOtp, validateInputs(verifyOtpSchema), authController.verifyOtp);
router.post(authRoutes.resendOtp, validateInputs(resendOtpSchema), authController.resendOtp);
router.post(authRoutes.refreshToken, authController.refreshToken);

export default router;