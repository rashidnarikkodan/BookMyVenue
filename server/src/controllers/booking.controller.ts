    import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';
import { AppError } from '@/utils/AppError';
import success from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import { createBookingService, getBookingByVenueId } from '@/services/booking.service';
import { CreateBookingPayload } from '@/types/booking.types';

// POST /bookings/confirm
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const payload: CreateBookingPayload = req.body;
    const booking = await createBookingService(userId, payload);

    success(res, HTTP_STATUS.CREATED, booking, "Booking created");
  } catch (error) {
    next(error);
  }
};


 export const getBookingAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId } = req.params;
        if (!venueId) throw new AppError("Venue id is required", HTTP_STATUS.BAD_REQUEST);
        const bookings = await getBookingByVenueId(venueId as string);
        success(res, HTTP_STATUS.OK, bookings, "Bookings Fetched")
    } catch (error) {
        next(error)
    }
}
