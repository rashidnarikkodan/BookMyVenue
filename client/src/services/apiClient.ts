import axios from 'axios';
import { useAppStore } from '@/store/app.store';

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

    if (error.response?.status === 401 && !originalRequest._retry) {
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

    return Promise.reject(error);
  }
);

export default apiClient;
