import { IBooking } from '@/types/booking.types';
import { BookingStatus, BookingScenario, PaymentStatus } from '@/constants/booking';

export interface UserBookingDTO {
  id: string;
  bookingStatus: string;
  paymentStatus: string;
  bookingScenario: string;
  startDateTime: string;
  endDateTime: string;
  guests: number;
  paymentMethod: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  amountPaid: number;
  remainingPaymentDueDate: string | null;
  autoCancellationDate: string | null;
  isImmediatePaymentRequired: boolean;
  cancellationReason: string;
  createdAt: string;
  venue: {
    id: string;
    name: string;
    imageUrl: string | null;
    location: string;
  };
  isCancellable: boolean;
}