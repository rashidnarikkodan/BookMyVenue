import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createBooking, getBookingAvailability } from '@/controllers/booking.controller';

const router = Router();

router.use(authMiddleware)

router.post('/', createBooking);
router.get('/availability/:venueId',getBookingAvailability);


export default router;
