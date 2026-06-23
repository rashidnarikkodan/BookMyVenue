import { apiClient } from '@/services/apiClient';

export const venuesApi = {
  getAll: async () => {
    const res = await apiClient.get('/users/venues');
    return res.data;
  },
  getAllCategories: async () => {
    const res = await apiClient.get('/venues/categories');
    return res.data;
  },
};
