import { HTTP_STATUS } from '@/constants/http';
import { createBooking, hasOverlappingBooking } from '@/repositories/booking.repository';
import { CreateBookingPayload } from '@/types/booking.types';
import { AppError } from '@/utils/AppError';
import { getAvailabilityByVenueId } from '@/repositories/availability.repository';
import { IAvailability } from '@/types/availability.types';
import * as bookingRepo from "@/repositories/booking.repository"


export const getBookingByVenueId = async (id: string) => {
  const bookings = await bookingRepo.getBookingByVenueId(id)
  return bookings
}



export const createBookingService = async (userId: string, payload: CreateBookingPayload) => {
  //validate dates
  const start = new Date(payload.startDateTime);
  const end = new Date(payload.endDateTime);

  if (start >= end) {
    throw new AppError('End date must be after the start date', HTTP_STATUS.BAD_REQUEST);
  }

  if (start < new Date()) {
    throw new AppError('Past dates are not allowed', HTTP_STATUS.BAD_REQUEST);
  }

  //
  const hasOverlapping = await hasOverlappingBooking(payload.venueId, start, end);

  if (hasOverlapping) {
    throw new AppError('Venue unavailable at the selected time', HTTP_STATUS.CONFLICT);
  }

  const availability: IAvailability | null = await getAvailabilityByVenueId(payload.venueId);
  if (!availability) {
    throw new AppError('Venue not available to book', HTTP_STATUS.NOT_FOUND);
  }
  const venuePricePerHour = availability.pricePerHour;
  const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  let totalAmount = durationInHours * venuePricePerHour;

  const gst = totalAmount * 0.18;
  const platformFee = totalAmount * 0.12;

  totalAmount += (gst + platformFee);

  const newBooking = await createBooking(userId, payload, totalAmount);

  return newBooking;
};

import { verifyPaymentSignature } from './razorpay.service';

export const verifyAndConfirmBookingService = async (
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) => {
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new AppError('Payment signature verification failed', HTTP_STATUS.BAD_REQUEST);
  }

  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check ownership
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  const updatedBooking = await bookingRepo.confirmPaidBooking(bookingId, booking.totalAmount);
  if (!updatedBooking) {
    throw new AppError('Failed to confirm booking', HTTP_STATUS.SERVER_ERROR);
  }

  return updatedBooking;
};

import { BookingStatus } from '@/constants/booking';

export const cancelPendingBookingService = async (userId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check ownership
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // Only allow deleting bookings that are PENDING_PAYMENT
  if (booking.bookingStatus !== BookingStatus.PENDING_PAYMENT) {
    throw new AppError('Only pending bookings can be cancelled', HTTP_STATUS.BAD_REQUEST);
  }

  await bookingRepo.deleteBookingById(bookingId);
};
