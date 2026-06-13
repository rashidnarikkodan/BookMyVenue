import axios from 'axios';
import { useAppStore } from '@/store/app.store';

const PUBLIC_AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/google',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/refresh-token',
];

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,

  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl: string = originalRequest?.url ?? '';

    const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.some((route) => requestUrl.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isPublicAuthRoute) {
      originalRequest._retry = true;

      try {
        await apiClient.post('/auth/refresh-token');

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAppStore.getState().logout();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && requestUrl.includes('/auth/refresh-token')) {
      useAppStore.getState().logout();
      window.location.href = '/signin';
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.message?.toLowerCase().includes('blocked')
    ) {
      useAppStore.getState().logout();
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
