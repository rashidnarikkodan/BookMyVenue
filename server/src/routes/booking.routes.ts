import { Router, Request, Response } from 'express';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import { NextFunction } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { confirmBooking } from '../controllers/booking.controller';
import { getBookingByVenueId } from '@/services/booking.service';

const router = Router();

router.use(authMiddleware)

router.get('/availability/:venueId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { venueId } = req.params;
        const bookings = await getBookingByVenueId(venueId as string);
        success(res, HTTP_STATUS.OK, bookings, "Bookings Fetched")
    } catch (error) {
        next(error)
    }
});

router.post('/confirm', authMiddleware, confirmBooking);

export default router;
