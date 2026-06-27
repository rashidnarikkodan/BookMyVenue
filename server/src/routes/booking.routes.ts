import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createBooking, getBookingAvailability } from '@/controllers/booking.controller';

const router = Router();

// Public route: anyone can check venue availability
router.get('/venues/:venueId', getBookingAvailability);

// Protected routes require authentication
router.use(authMiddleware);

router.post('/', createBooking);


export default router;
