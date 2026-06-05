export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AUTH_ROUTES = {
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  SIGNIN: `${API_BASE_URL}/auth/signin`,
};
