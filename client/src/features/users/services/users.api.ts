import { apiClient } from '@/services/apiClient';
import type { OwnerVerificationResponse, User, UserQuery, MyBookingsResponse } from '../types';

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
    console.log(usersData);
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
      verificationStatus: u.owner?.verificationStatus,
      rejectionReason: u.owner?.rejectionReason,
      verifiedAt: u.owner?.verifiedAt,
      owner: u.owner,
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
  approveOwner: async (
    id: string
  ): Promise<{ success: boolean; message: string; data: OwnerVerificationResponse }> => {
    const res = await apiClient.patch(`/admin/owners/${id}/approve`);

    console.log(res.data);

    return {
      ...res.data,
    };
  },

  rejectOwner: async (
    id: string,
    reason: string
  ): Promise<{ success: boolean; message: string; data: OwnerVerificationResponse }> => {
    const res = await apiClient.patch(`/admin/owners/${id}/reject`, {
      reason,
    });

    return {
      ...res.data,
    };
  },

  getBookings: async (): Promise<{
    success: boolean;
    message: string;
    data: MyBookingsResponse;
  }> => {
    const res = await apiClient.get('/users/bookings');
    const rawData = res.data?.data;
    const mappedBookings = (rawData?.bookings || []).map((b: any) => ({
      id: b._id || b.id,
      venue: {
        id: b.venue?._id || b.venue?.id,
        name: b.venue?.name || '',
        imageUrl: b.venue?.images?.[0] || null,
        location: b.venue?.address
          ? `${b.venue.address.city || ''}, ${b.venue.address.state || ''}`
          : b.venue?.location || '',
      },
      startDateTime: b.startDateTime,
      endDateTime: b.endDateTime,
      guests: b.guests,
      contactName: b.contactName,
      contactEmail: b.contactEmail,
      contactPhone: b.contactPhone,
      specialRequests: b.specialRequests || '',
      paymentMethod: b.paymentMethod,
      bookingStatus: b.bookingStatus ? b.bookingStatus.toLowerCase() : '',
      paymentStatus: b.paymentStatus ? b.paymentStatus.toLowerCase() : '',
      totalAmount: b.totalAmount,
      amountPaid: b.amountPaid,
      cancellationReason: b.cancellationReason || '',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    return {
      success: res.data?.success || true,
      message: res.data?.message || '',
      data: {
        bookings: mappedBookings,
        totalBookings: rawData?.totalBookings ?? mappedBookings.length,
      },
    };
  },
};
