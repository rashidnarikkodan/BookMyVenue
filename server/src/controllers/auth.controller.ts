import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IAuthService } from '../services/interfaces/auth.service.interface';
import { TYPES } from '../constants/types';
import { signupSchema, verifyOtpSchema, resendOtpSchema } from '../utils/validations';
import success from '../utils/response';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService,
  ) {}

  // ─── POST /api/auth/signup ────────────────────────────────────────────────
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const result = await this.authService.signup(validatedData);
      success(res, HTTP_STATUS.CREATED, MESSAGES.USER_CREATED, result);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name === 'ZodError') {
        next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST));
        return;
      }
      next(error);
    }
  };

  // ─── POST /api/auth/verify-otp ────────────────────────────────────────────
  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { registrationToken, otp } = verifyOtpSchema.parse(req.body);
      const result = await this.authService.verifyOtp(registrationToken, otp);
      success(res, HTTP_STATUS.OK, MESSAGES.USER_VERIFIED, result);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name === 'ZodError') {
        next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST));
        return;
      }
      next(error);
    }
  };

  // ─── POST /api/auth/resend-otp ────────────────────────────────────────────
  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { registrationToken } = resendOtpSchema.parse(req.body);
      await this.authService.resendOtp(registrationToken);
      success(res, HTTP_STATUS.OK, MESSAGES.OTP_RESENT, null);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.name === 'ZodError') {
        next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST));
        return;
      }
      next(error);
    }
  };

  // ─── POST /api/auth/google ────────────────────────────────────────────────
  googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { credential } = req.body;
      if (!credential) {
        next(new AppError('Google credential is required', HTTP_STATUS.BAD_REQUEST));
        return;
      }
      const result = await this.authService.googleAuth(credential);
      success(res, HTTP_STATUS.OK, 'Google Login Successful', result);
    } catch (error: unknown) {
      next(error);
    }
  };
}
