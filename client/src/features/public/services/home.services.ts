import { apiClient } from "@/services/apiClient";
import type { Venue } from "@/features/venues/types/venues.types";
import type { Category } from "@/features/categories/types";

export interface HomeDataResponse {
  venues: Venue[];
  categories: Category[];
}

export const getHomeData = async (): Promise<HomeDataResponse> => {
  const res = await apiClient.get('/users/home');
  return res.data.data;
};