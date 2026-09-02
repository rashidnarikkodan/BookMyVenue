import cron from 'node-cron';
import mongoose from 'mongoose';
import Booking from '../models/booking.model';
import { BookingStatus, PaymentStatus, CancellationType, RefundStatus } from '../constants/booking';
import logger from '../libs/logger';

export const startAutoCancellationJob = () => {
  // Runs every minute to promptly free expired 10-minute checkout reservations and handle overdue balances
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      // ── Step 1: Clean up expired PENDING checkout holds (10-Minute Soft Lock) ──
      const expiredPendingBookings = await Booking.find({
        bookingStatus: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        $or: [
          { reservationExpiresAt: { $lte: now, $ne: null } },
          { reservationExpiresAt: null, createdAt: { $lte: tenMinutesAgo } },
        ],
      });

      if (expiredPendingBookings.length > 0) {
        logger.info(`[AutoCancellation] Found ${expiredPendingBookings.length} expired checkout holds to release.`);

        for (const pendingBooking of expiredPendingBookings) {
          try {
            await Booking.findByIdAndUpdate(pendingBooking._id, {
              bookingStatus: BookingStatus.EXPIRED,
              cancellationType: CancellationType.SYSTEM,
              cancelledAt: new Date(),
              cancellationReason: 'Checkout hold expired: 10-minute payment window timed out',
            });
            logger.info(`[AutoCancellation] Successfully expired checkout hold for booking ${pendingBooking._id}, slot is now free.`);
          } catch (err) {
            logger.error(`[AutoCancellation] Failed to expire pending booking ${pendingBooking._id}: ${err instanceof Error ? err.message : 'Unknown error'}`);
          }
        }
      }

      // ── Step 2: Handle overdue balance cancellations for RESERVED/CONFIRMED bookings ──
      const expiredBookings = await Booking.find({
        bookingStatus: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
        paymentStatus: { $ne: PaymentStatus.PAID },
        remainingPaymentDueDate: { $lt: now, $ne: null },
      });

      if (expiredBookings.length === 0) {
        return;
      }

      logger.info(`[AutoCancellation] Found ${expiredBookings.length} overdue bookings for auto-cancellation.`);

      for (const booking of expiredBookings) {
        const session = await mongoose.startSession();
        try {
          session.startTransaction();

          // Revalidate booking
          const activeBooking = await Booking.findOne({
            _id: booking._id,
            bookingStatus: { $in: [BookingStatus.RESERVED, BookingStatus.CONFIRMED] },
            paymentStatus: { $ne: PaymentStatus.PAID },
            remainingPaymentDueDate: { $lt: new Date(), $ne: null },
          }).session(session);

          if (!activeBooking) {
            logger.warn(`Booking ${booking._id} is no longer eligible for auto-cancellation (maybe paid or already cancelled).`);
            await session.abortTransaction();
            continue;
          }

          // Cancel the booking
          activeBooking.bookingStatus = BookingStatus.CANCELLED;
          activeBooking.cancellationType = CancellationType.SYSTEM;
          activeBooking.refundStatus = RefundStatus.NOT_ELIGIBLE; // System cancellation = no refund
          activeBooking.cancelledAt = new Date();
          activeBooking.cancellationReason = 'System Auto-cancellation: Payment deadline expired';

          await activeBooking.save({ session });

          // Commit transaction
          await session.commitTransaction();
          logger.info(`Successfully auto-cancelled booking ${booking._id}`);

        } catch (error) {
          await session.abortTransaction();
          logger.error(`Failed to auto-cancel booking ${booking._id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          session.endSession();
        }
      }
    } catch (error) {
      logger.error(`Auto Cancellation Scheduler failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
