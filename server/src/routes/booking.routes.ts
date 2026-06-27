import { Router, Request, Response } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { confirmBooking } from '../controllers/booking.controller';

const router = Router();

router.post('/confirm', authMiddleware, confirmBooking);

export default router;
