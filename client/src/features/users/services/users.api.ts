import { apiClient } from '@/services/apiClient';
import type { User, UserQuery } from '../types';

export const usersApi = {
  getAll: async (
    query: UserQuery
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      users: User[];
      totalUsers: number;
    };
  }> => {
    const res = await apiClient.get('/admin/users', { params: query });
    const usersData = res.data.data.users.map((u: any) => ({
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    console.log(usersData)
    return {
      ...res.data,
      data: {
        users: usersData,
        totalUsers: res.data.data.totalUsers,
      },
    };
  },

  getById: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.get(`/admin/users/${id}`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },

  remove: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.patch(`/admin/users/${id}/block`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },

  restore: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    const res = await apiClient.patch(`/admin/users/${id}/unblock`);
    const u = res.data.data;
    const mappedUser = {
      id: u._id,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: !u.isBlocked,
      imageUrl: u.avatar || null,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
    return {
      ...res.data,
      data: mappedUser,
    };
  },
};
