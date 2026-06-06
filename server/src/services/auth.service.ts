import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { IAuthService } from './interfaces/auth.service.interface';
import { userRepository } from '../repositories/user.repository';
import { otpService } from './otp.service';
import { AppError } from '../utils/AppError';
import { IUser } from '@/models/interfaces/user-scheme.interface';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';
import env from '../configs/env.config';

interface RegistrationTokenPayload {
  email: string;
  purpose: 'email-verification';
}

export const authService: IAuthService = {

  async signup(userData: Partial<IUser>): Promise<{ email: string; registrationToken: string }> {
    const email = (userData.email as string).toLowerCase().trim();

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
      throw new AppError(MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    if (existingUser && !existingUser.isVerified) {
      await userRepository.deleteById(existingUser._id!.toString());
    }

    const hashedPassword = await argon2.hash(userData.password as string);
    await userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await otpService.generateAndSendOtp(email);

    const registrationToken = jwt.sign(
      { email, purpose: 'email-verification' } as RegistrationTokenPayload,
      env.JWT_REGISTRATION_SECRET ?? env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    return { email, registrationToken };
  },

  async verifyOtp(
    registrationToken: string,
    otp: string,
  ): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> {
    let payload: RegistrationTokenPayload;
    try {
      payload = jwt.verify(
        registrationToken,
        env.JWT_REGISTRATION_SECRET ?? env.JWT_ACCESS_SECRET,
      ) as RegistrationTokenPayload;
    } catch {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (payload.purpose !== 'email-verification') {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    await otpService.verifyOtp(payload.email, otp);

    const user = await userRepository.findByEmail(payload.email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    const updatedUser = await userRepository.update(user._id!.toString(), { isVerified: true });
    if (!updatedUser) {
      throw new AppError(MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const token = jwt.sign(
      { userId: updatedUser._id, role: updatedUser.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' },
    );

    const refreshToken = jwt.sign(
      { userId: updatedUser._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' },
    );

    const userObj = updatedUser.toObject();
    delete userObj.password;

    return { user: userObj, token, refreshToken };
  },

  async resendOtp(registrationToken: string): Promise<void> {
    let payload: RegistrationTokenPayload;
    try {
      payload = jwt.verify(
        registrationToken,
        env.JWT_REGISTRATION_SECRET ?? env.JWT_ACCESS_SECRET,
      ) as RegistrationTokenPayload;
    } catch {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (payload.purpose !== 'email-verification') {
      throw new AppError(MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const { allowed, secondsLeft } = await otpService.canResend(payload.email);

    if (!allowed && secondsLeft === 0) {
      throw new AppError(MESSAGES.OTP_RESEND_LIMIT, HTTP_STATUS.TOO_MANY_REQUESTS);
    }

    if (!allowed) {
      throw new AppError(
        `${MESSAGES.OTP_RESEND_COOLDOWN}. Try again in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'}.`,
        HTTP_STATUS.TOO_MANY_REQUESTS,
      );
    }

    await otpService.generateAndSendOtp(payload.email);
  },

  async googleAuth(
    idToken: string,
  ): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> {
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AppError('Invalid Google Token', HTTP_STATUS.UNAUTHORIZED);
    }

    const { email, name, picture, sub: googleId } = payload;
    let user = await userRepository.findByEmail(email);

    if (user) {
      if (!user.googleId) {
        user = await userRepository.update(user._id!.toString(), {
          googleId,
          avatar: picture,
          authProvider: 'google',
          isVerified: true,
        });
      }
    } else {
      user = await userRepository.create({
        fullName: name || 'Google User',
        email,
        googleId,
        avatar: picture,
        authProvider: 'google',
        isVerified: true,
      });
    }

    if (!user) {
      throw new AppError('Failed to process Google login', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' },
    );

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token, refreshToken };
  },

  async signin(data: {
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }> {
    const email = (data.email as string).toLowerCase().trim();

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      throw new AppError('Please verify your email first', HTTP_STATUS.FORBIDDEN);
    }

    if (!user.password) {
      throw new AppError('Please sign in with Google', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await argon2.verify(user.password, data.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '7d' },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' },
    );

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token, refreshToken };
  },
};
