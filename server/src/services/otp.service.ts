import crypto from 'crypto';
import argon2 from 'argon2';
import { IOtpService } from './interfaces/otp.service.interface';
import { redisService } from './redis.service';
import { emailService } from './email.service';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/http';
import env from '../configs/env.config';
import logger from '@/libs/logger';

const keys = {
  otp:         (email: string) => `otp:hash:${email}`,
  verifyCount: (email: string) => `otp:verify_count:${email}`,
  resendCount: (email: string) => `otp:resend_count:${email}`,
  resendAt:    (email: string) => `otp:resend_at:${email}`,
};

export const otpService: IOtpService = {
  async generateAndSendOtp(emailAddr: string): Promise<void> {
    const otp = crypto.randomInt(100000, 999999).toString();
    logger.info(`OTP: ${otp}`);

    const hashed = await argon2.hash(otp);

    // Store hashed OTP with expiry
    await redisService.set(keys.otp(emailAddr), hashed, env.OTP_EXPIRY_SECONDS);

    // Reset verify attempt counter
    await redisService.del(keys.verifyCount(emailAddr));

    // Record resend timestamp for cooldown period
    await redisService.set(
      keys.resendAt(emailAddr),
      Date.now().toString(),
      env.OTP_EXPIRY_SECONDS + env.RESEND_COOLDOWN_SECONDS,
    );

    try {
      await emailService.sendOtpEmail(emailAddr, otp);
    } catch {
      await redisService.del(keys.otp(emailAddr));
      throw new AppError(MESSAGES.OTP_EMAIL_FAIL, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },

  async verifyOtp(emailAddr: string, otp: string): Promise<void> {
    const hashedOtp = await redisService.get(keys.otp(emailAddr));
    if (!hashedOtp) {
      throw new AppError(MESSAGES.OTP_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }

    // Check verify attempt count
    const attemptKey = keys.verifyCount(emailAddr);
    const attempts = parseInt((await redisService.get(attemptKey)) ?? '0', 10);
    if (attempts >= env.MAX_VERIFY_ATTEMPTS) {
      await redisService.del(keys.otp(emailAddr));
      await redisService.del(attemptKey);
      throw new AppError(MESSAGES.OTP_MAX_ATTEMPTS, HTTP_STATUS.TOO_MANY_REQUESTS);
    }

    const isValid = await argon2.verify(hashedOtp, otp);
    if (!isValid) {
      const newCount = await redisService.incr(attemptKey);
      await redisService.expire(attemptKey, env.OTP_EXPIRY_SECONDS);
      const remaining = env.MAX_VERIFY_ATTEMPTS - newCount;
      throw new AppError(
        `${MESSAGES.OTP_INVALID}. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // OTP is valid clear all keys
    await redisService.del(keys.otp(emailAddr));
    await redisService.del(keys.verifyCount(emailAddr));
    await redisService.del(keys.resendCount(emailAddr));
    await redisService.del(keys.resendAt(emailAddr));
  },

  async canResend(emailAddr: string): Promise<{ allowed: boolean; secondsLeft: number }> {
    const resendAtRaw = await redisService.get(keys.resendAt(emailAddr));
    if (resendAtRaw) {
      const elapsed = (Date.now() - parseInt(resendAtRaw, 10)) / 1000;
      if (elapsed < env.RESEND_COOLDOWN_SECONDS) {
        return { allowed: false, secondsLeft: Math.ceil(env.RESEND_COOLDOWN_SECONDS - elapsed) };
      }
    }

    const resendCount = parseInt((await redisService.get(keys.resendCount(emailAddr))) ?? '0', 10);
    if (resendCount >= env.MAX_RESEND_COUNT) {
      return { allowed: false, secondsLeft: 0 };
    }

    return { allowed: true, secondsLeft: 0 };
  },
};
