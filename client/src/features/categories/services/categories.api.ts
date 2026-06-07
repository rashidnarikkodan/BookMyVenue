import { apiClient } from "@/services/apiClient";

export const categoriesApi = {
  getAll: (query) => apiClient.get(`/admin/categories?search=${query.search}&sort=${query.sort}&status=${query.status}`),
  getById: (id: string) => apiClient.get(`/admin/categories/${id}`),
  create: (data: any) => apiClient.post("/admin/categories", data),
  update: (id: string, data: any) => apiClient.patch(`/admin/categories/${id}`, data),
  remove: (id: string) => apiClient.delete(`/admin/categories/${id}`),
  restore: (id: string) => apiClient.patch(`/admin/categories/${id}/restore`),
};