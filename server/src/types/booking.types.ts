import { Document, Types } from 'mongoose';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@/constants/booking';

export interface IBooking extends Document {
  venue: Types.ObjectId;
  user: Types.ObjectId;
  startDateTime: Date;
  endDateTime: Date;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests: string;
  paymentMethod: PaymentMethod;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  amountPaid: number;
  cancellationReason: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shape expected from the client when creating a booking
export interface CreateBookingPayload {
  venueId: string;
  startDateTime: string;
  endDateTime: string;
  guests: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  paymentMethod: PaymentMethod;
}
