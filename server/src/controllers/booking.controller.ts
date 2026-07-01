import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';
import { AppError } from '@/utils/AppError';
import success from '@/utils/response';
import { NextFunction, Request, Response } from 'express';
import {
  createBookingService,
  getBookingByVenueId,
  verifyAndConfirmBookingService,
  cancelPendingBookingService,
} from '@/services/booking.service';
import { createOrder as createRazorpayOrder } from '@/services/razorpay.service';
import { CreateBookingPayload } from '@/types/booking.types';

// POST /bookings/confirm
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const payload: CreateBookingPayload = req.body;
    const booking = await createBookingService(userId, payload);

    let orderDetails = null;
    if (payload.paymentMethod === 'razorpay') {
      orderDetails = await createRazorpayOrder(booking.totalAmount, booking._id.toString());
    }

    success(res, HTTP_STATUS.CREATED, { payment: orderDetails, booking }, 'Booking created');
  } catch (error) {
    next(error);
  }
};

// POST /bookings/verify-payment
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      throw new AppError('Missing payment verification details', HTTP_STATUS.BAD_REQUEST);
    }

    // Since payment is verified, confirm the booking
    const booking = await verifyAndConfirmBookingService(
      userId,
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    success(res, HTTP_STATUS.OK, booking, 'Payment verified and booking confirmed');
  } catch (error) {
    next(error);
  }
};

// DELETE /bookings/pending/:bookingId
export const cancelPendingBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const { bookingId } = req.params;
    if (!bookingId || typeof bookingId !== 'string') {
      throw new AppError('Invalid Booking ID parameter', HTTP_STATUS.BAD_REQUEST);
    }

    await cancelPendingBookingService(userId, bookingId);

    success(res, HTTP_STATUS.OK, null, 'Pending booking cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const getBookingAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { venueId } = req.params;
    if (!venueId) throw new AppError('Venue id is required', HTTP_STATUS.BAD_REQUEST);
    const bookings = await getBookingByVenueId(venueId as string);
    success(res, HTTP_STATUS.OK, bookings, 'Bookings Fetched');
  } catch (error) {
    next(error);
  }
};
