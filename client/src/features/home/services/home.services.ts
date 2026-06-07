import { apiClient } from '@/services/apiClient';
import type { Venue } from '../../venues/types/venues.types';

export const getEliteVenues = async (): Promise<Venue[]> => {
  const res = await apiClient.get('/venues/elite');
  return res.data;
};

export const getCategories = async () => {
  const res = await apiClient.get('/categories');
  return res.data;
};

export const getCities = async () => {
  const res = await apiClient.get('/cities');
  return res.data;
};
