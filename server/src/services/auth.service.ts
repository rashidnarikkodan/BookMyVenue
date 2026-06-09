import argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { MESSAGES } from '@/constants/messages';
import { HTTP_STATUS } from '@/constants/http';
import env from '@/configs/env.config';
import { AppError } from '@/utils/AppError';
import { userRepository } from '@/repositories/user.repository';
import { IUser } from '@/models/user.model';
import { otpService } from './otp.service';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, jwtVerify } from '@/utils/jwtUtils';
import { redisService } from './redis.service';

type RegistrationTokenPayload = {
  email: string;
  purpose: 'email-verification';
};

const signup = async (
  userData: Partial<IUser>,
): Promise<{ email: string; registrationToken: string }> => {
  const email = userData.email!.toLowerCase().trim();

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser?.isVerified) {
    throw new AppError(
      MESSAGES.USER_ALREADY_EXISTS,
      HTTP_STATUS.CONFLICT,
    );
  }

  if (existingUser && !existingUser.isVerified) {
    await userRepository.deleteById(existingUser._id.toString());
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
    {
      email,
      purpose: 'email-verification',
    },
    env.JWT_REGISTRATION_SECRET as string,
    { expiresIn: '15m' },
  );

  return {
    email,
    registrationToken,
  };
};

const verifyRegistrationToken = (registrationToken: string): RegistrationTokenPayload => {
  try {
    const payload = jwt.verify(
      registrationToken,
      env.JWT_REGISTRATION_SECRET as string,
    ) as RegistrationTokenPayload;

    if (payload.purpose !== 'email-verification') {
      throw new Error();
    }

    return payload;
  } catch {
    throw new AppError(
      MESSAGES.INVALID_TOKEN,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }
};


const verifyOtp = async (
  registrationToken: string,
  otp: string,
): Promise<{ user: Partial<IUser> }> => {
  const payload = verifyRegistrationToken(registrationToken);

  await otpService.verifyOtp(payload.email, otp);

  const user = await userRepository.findByEmail(payload.email);

  if (!user) {
    throw new AppError(
      MESSAGES.USER_NOT_FOUND,
      HTTP_STATUS.NOT_FOUND,
    );
  }

  const updatedUser = await userRepository.update(
    user._id.toString(),
    {
      isVerified: true,
    },
  );

  if (!updatedUser) {
    throw new AppError(
      MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj };
};

const resendOtp = async (
  registrationToken: string,
): Promise<void> => {
  const payload = verifyRegistrationToken(registrationToken);

  const { allowed, secondsLeft } =
    await otpService.canResend(payload.email);

  if (!allowed && secondsLeft === 0) {
    throw new AppError(
      MESSAGES.OTP_RESEND_LIMIT,
      HTTP_STATUS.TOO_MANY_REQUESTS,
    );
  }

  if (!allowed) {
    throw new AppError(
      `${MESSAGES.OTP_RESEND_COOLDOWN}. Try again in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'
      }.`,
      HTTP_STATUS.TOO_MANY_REQUESTS,
    );
  }

  await otpService.generateAndSendOtp(payload.email);
};

const signin = async (data: {
  email: string,
  password: string
}): Promise<{
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}> => {

  const email = data.email.toLowerCase().trim();
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError(
      MESSAGES.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  if (!user.isVerified) {
    throw new AppError(
      'Please verify your email first',
      HTTP_STATUS.FORBIDDEN,
    );
  }

  if (!user.password) {
    throw new AppError(
      'Please sign in with Google',
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const isMatch = await argon2.verify(
    user.password,
    data.password,
  );

  if (!isMatch) {
    throw new AppError(
      MESSAGES.INVALID_CREDENTIALS,
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

  const key = `refresh_token:${user._id}`;
  await redisService.set(key, refreshToken, REFRESH_TOKEN_TTL);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

const googleAuth = async (idToken: string,): Promise<{
  user: Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}> => {
  const client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
  );

  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new AppError(
      'Invalid Google token',
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const {
    email,
    name,
    picture,
    sub: googleId,
  } = payload;

  let user = await userRepository.findByEmail(email);

  if (user) {
    if (!user.googleId) {
      user = await userRepository.update(
        user._id!.toString(),
        {
          googleId,
          avatar: picture,
          authProvider: 'google',
          isVerified: true,
        },
      );
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
    throw new AppError(
      'Failed to process Google login',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;
  const key = `refresh_token:${user._id}`;
  await redisService.set(key, refreshToken, REFRESH_TOKEN_TTL);

  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};


export const refreshTokenService = async (refreshToken: string) => {

  if (!refreshToken) {
    throw new AppError("Refresh token is missing", HTTP_STATUS.UNAUTHORIZED);
  }

  const decoded = jwtVerify(refreshToken, "refresh");

  if (typeof decoded === "string" || !decoded.id) {
    throw new AppError("Invalid or expired refresh token", HTTP_STATUS.UNAUTHORIZED);
  }

  const key = `refresh_token:${decoded?.id}`;
  const storedToken = await redisService.get(key);

  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError("Refresh token not found or already revoked", HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken };
}


export const authService = {
  signup,
  verifyOtp,
  resendOtp,
  signin,
  googleAuth,
};