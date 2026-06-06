import { apiClient } from "@/services/apiClient";

export const categoriesApi = {
  getAll: () => apiClient.get("/categories"),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
  create: (data: any) => apiClient.post("/categories", data),
  update: (id: string, data: any) => apiClient.patch(`/categories/${id}`, data),
  remove: (id: string) => apiClient.delete(`/categories/${id}`),
  restore: (id: string) => apiClient.patch(`/categories/${id}/restore`),
};