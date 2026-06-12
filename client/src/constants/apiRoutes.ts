export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AUTH_ROUTES = {
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  SIGNIN: `${API_BASE_URL}/auth/signin`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};
