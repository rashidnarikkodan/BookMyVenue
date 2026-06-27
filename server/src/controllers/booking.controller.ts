import { HTTP_STATUS } from '@/constants/http';
import success from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import {createBookingService } from '../services/booking.service';

export const confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingInfo } = req.body;

    await createBookingService(bookingInfo);

    success(res, HTTP_STATUS.OK, {}, 'Venue reserved');
  } catch (error) {
    next(error);
  }
};
