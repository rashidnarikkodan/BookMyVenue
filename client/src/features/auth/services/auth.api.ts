import { AUTH_ROUTES } from '@/constants/apiRoutes';
import apiClient from '@/services/apiClient';
import type { ISigninData, ISignupData } from '../types/auth.types';

export const signupApi = async (data: ISignupData) => {
  return await apiClient.post(AUTH_ROUTES.SIGNUP, data);
};

export const signinApi = async (data: ISigninData) => {
  return await apiClient.post(AUTH_ROUTES.SIGNIN, data);
};

export const googleAuthApi = async (credential: string, role?: string) => {
  return await apiClient.post(AUTH_ROUTES.GOOGLE_AUTH, { credential, role });
};

export const verifyOtpApi = async (registrationToken: string, otp: string) => {
  return await apiClient.post(AUTH_ROUTES.VERIFY_OTP, { registrationToken, otp });
};

export const resendOtpApi = async (registrationToken: string) => {
  return await apiClient.post(AUTH_ROUTES.RESEND_OTP, { registrationToken });
};

export const logoutApi = async () => {
  return await apiClient.post(AUTH_ROUTES.LOGOUT);
};
