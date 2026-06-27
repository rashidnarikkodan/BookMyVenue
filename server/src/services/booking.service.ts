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
