import { Request, Response, NextFunction } from 'express';
import { signupSchema, verifyOtpSchema, resendOtpSchema, signinSchema } from '../utils/validations';
import success from '../utils/response';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';
import { authService } from '../services/auth.service';
import { handleControllerError } from '@/utils/handleControllerError';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const result = await authService.signup(validatedData);
    success(res, HTTP_STATUS.CREATED, MESSAGES.USER_CREATED, result);
  } catch (error: unknown) {
    handleControllerError(error, next);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { registrationToken, otp } = verifyOtpSchema.parse(req.body);
    const result = await authService.verifyOtp(registrationToken, otp);
    success(res, HTTP_STATUS.OK, MESSAGES.USER_VERIFIED, result);
  } catch (error: unknown) {
    handleControllerError(error, next);
  }
};

export const resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { registrationToken } = resendOtpSchema.parse(req.body);
    await authService.resendOtp(registrationToken);
    success(res, HTTP_STATUS.OK, MESSAGES.OTP_RESENT, null);
  } catch (error: unknown) {
    handleControllerError(error, next);
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) {
      next(new AppError('Google credential is required', HTTP_STATUS.BAD_REQUEST));
      return;
    }
    const result = await authService.googleAuth(credential);
    success(res, HTTP_STATUS.OK, 'Google Login Successful', result);
  } catch (error: unknown) {
    next(error);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = signinSchema.parse(req.body);
    const result = await authService.signin(validatedData);
    success(res, HTTP_STATUS.OK, 'Sign In Successful', result);
  } catch (error: unknown) {
    handleControllerError(error, next);
  }
};
