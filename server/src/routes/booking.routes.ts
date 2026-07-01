import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
  createBooking,
  getBookingAvailability,
  verifyPayment,
  cancelPendingBooking,
  payBalance,
  verifyBalancePayment,
  getBookingQuote,
  cancelBooking,
} from '@/controllers/booking.controller';

const router = Router();

// Public route: anyone can check venue availability
router.get('/venues/:venueId', getBookingAvailability);

// Protected routes require authentication
router.use(authMiddleware);

router.post('/quote', getBookingQuote);
router.post('/', createBooking);
router.post('/verify-payment', verifyPayment);
router.post('/pay-balance', payBalance);
router.post('/verify-balance', verifyBalancePayment);
router.delete('/pending/:bookingId', cancelPendingBooking);
router.patch('/:bookingId/cancel', cancelBooking);

export default router;
