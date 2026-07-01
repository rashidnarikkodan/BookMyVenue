import { apiClient } from '@/services/apiClient';
import type { BookingDetails } from '../types/bookings.types';

export const bookingsApi = {
  createBooking: async (bookingData: BookingDetails): Promise<any> => {
    const res = await apiClient.post('/bookings', bookingData);
    return res.data;
  },

  calculateQuote: async (quoteData: {
    venueId: string;
    startDateTime: string;
    endDateTime: string;
  }): Promise<any> => {
    const res = await apiClient.post('/bookings/quote', quoteData);
    return res.data;
  },

  cancelPendingBooking: async (bookingId: string): Promise<any> => {
    const res = await apiClient.delete(`/bookings/pending/${bookingId}`);
    return res.data;
  },

  cancelBooking: async (bookingId: string, reason: string): Promise<any> => {
    const res = await apiClient.patch(`/bookings/${bookingId}/cancel`, { reason });
    return res.data;
  },

  verifyPayment: async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    bookingId: string;
  }): Promise<any> => {
    const res = await apiClient.post('/bookings/verify-payment', paymentData);
    return res.data;
  },

  payBalance: async (bookingId: string): Promise<any> => {
    const res = await apiClient.post('/bookings/pay-balance', { bookingId });
    return res.data;
  },

  verifyBalancePayment: async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    bookingId: string;
  }): Promise<any> => {
    const res = await apiClient.post('/bookings/verify-balance', paymentData);
    return res.data;
  },

  getByVenueId: async (id: string): Promise<any> => {
    try {
      const res = await apiClient.get(`/bookings/venues/${id}`);
      return res.data.data;
    } catch (err: any) {
      console.error('Failed to fetch venue bookings', err);
      return null;
    }
  },
};
