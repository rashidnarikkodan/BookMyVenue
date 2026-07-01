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
    const mappedBookings = (rawData?.bookings || []).map((b: any) => {
      let remainingPaymentDueDate = b.remainingPaymentDueDate || null;
      let isImmediatePaymentRequired = !!b.isImmediatePaymentRequired;
      let autoCancellationDate = b.autoCancellationDate || null;

      const mappedPaymentStatus = b.paymentStatus
        ? b.paymentStatus.toLowerCase() === 'deposit_paid'
          ? 'partial'
          : b.paymentStatus.toLowerCase()
        : '';
      const mappedBookingStatus = b.bookingStatus ? b.bookingStatus.toLowerCase() : '';

      if (
        !remainingPaymentDueDate &&
        mappedBookingStatus === 'reserved' &&
        (mappedPaymentStatus === 'partial' || mappedPaymentStatus === 'deposit_paid')
      ) {
        const eventDate = new Date(b.startDateTime);
        const bookingDate = new Date(b.createdAt || b.bookingDate || Date.now());
        const diffMs = eventDate.getTime() - bookingDate.getTime();
        const leadTimeDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));

        if (leadTimeDays >= 7) {
          const offsetDays = leadTimeDays * 0.5;
          const calculatedDue = new Date(eventDate.getTime() - offsetDays * 24 * 60 * 60 * 1000);
          calculatedDue.setHours(23, 59, 59, 999);
          remainingPaymentDueDate = (
            calculatedDue > eventDate ? eventDate : calculatedDue
          ).toISOString();

          const calculatedCancel = new Date(
            new Date(remainingPaymentDueDate).getTime() + 24 * 60 * 60 * 1000
          );
          autoCancellationDate = (
            calculatedCancel > eventDate ? eventDate : calculatedCancel
          ).toISOString();
        } else {
          remainingPaymentDueDate = bookingDate.toISOString();
          isImmediatePaymentRequired = true;
          autoCancellationDate = new Date(bookingDate.getTime() + 30 * 60 * 1000).toISOString();
        }
      }

      return {
        id: b._id || b.id,
        venue: {
          id: b.venue?._id || b.venue?.id,
          name: b.venue?.name || '',
          imageUrl: b.venue?.imageUrl || b.venue?.images?.[0] || null,
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
        bookingStatus: mappedBookingStatus,
        paymentStatus: mappedPaymentStatus,
        totalAmount: b.totalAmount,
        amountPaid: b.amountPaid,
        remainingPaymentDueDate,
        autoCancellationDate,
        isImmediatePaymentRequired,
        cancellationReason: b.cancellationReason || '',
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      };
    });

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
