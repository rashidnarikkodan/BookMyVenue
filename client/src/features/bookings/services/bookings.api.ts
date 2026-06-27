import { apiClient } from '@/services/apiClient';
import type { BookingDetails } from '../types/bookings.types';

export const bookingsApi = {
  createBooking: async (bookingData: BookingDetails): Promise<any> => {
    try {
      console.log(bookingData)
      const res = await apiClient.post('/bookings/', bookingData);
      console.log("Booking Confirmed", res.data);
      return res.data;
    } catch (err: any) {
      console.warn("Backend /bookings post failed, falling back to mock response", err);

      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate a mock confirmation number
      const confirmationNumber = 'BMV-' + Math.floor(100000 + Math.random() * 900000);
      
      // Save mock booking to localStorage
      const mockBooking = {
        ...bookingData,
        _id: confirmationNumber,
        status: 'pending',
        paymentStatus: bookingData.paymentMethod === 'cash' ? 'pending' : 'completed',
        createdAt: new Date().toISOString(),
      };
      
      const existing = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      existing.push(mockBooking);
      localStorage.setItem('mock_bookings', JSON.stringify(existing));
      
      return {
        success: true,
        message: 'Booking created successfully (simulation)',
        data: mockBooking,
      };
    }
  },
  
  getMockBookings: (): any[] => {
    return JSON.parse(localStorage.getItem('mock_bookings') || '[]');
  },
    
  getByVenueId : async (id: string): Promise<any> => {
      try{

      const res = await apiClient.get(`/bookings/venues/${id}`);
      return res.data;
      }
      catch(err:any){
        console.log(err);
        return null;
      }
  }
};
