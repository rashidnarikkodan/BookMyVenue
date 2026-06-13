import { apiClient } from '@/services/apiClient';
import type { Venue, VenueQuery, VenueListResponse, ApiResponse } from '../types/venues.types';

export const ownerVenuesApi = {
  getAll: async (query: VenueQuery): Promise<ApiResponse<VenueListResponse>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.status && query.status !== 'all') params.set('status', query.status);
    if (query.category) params.set('category', query.category);
    if (query.sort) params.set('sort', query.sort);

    const res = await apiClient.get(`/owners/venues?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.get(`/owners/venues/${id}`);
    return res.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.post('/owners/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.patch(`/owners/venues/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
