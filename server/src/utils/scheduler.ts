import Booking from '@/models/booking.model';
import { BookingStatus, PaymentStatus } from '@/constants/booking';
import logger from '@/libs/logger';

export const runOverdueAndCancellationCheck = async () => {
  const now = new Date();

  try {
    // 1. Transition to OVERDUE
    // Find all reserved bookings where:
    // - bookingStatus is RESERVED
    // - paymentStatus is PENDING or PARTIAL
    // - remainingPaymentDueDate is set and past
    const overdueResult = await Booking.updateMany(
      {
        bookingStatus: BookingStatus.RESERVED,
        paymentStatus: {
          $in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.DEPOSIT_PAID],
        },
        remainingPaymentDueDate: { $ne: null, $lt: now },
      },
      {
        $set: { paymentStatus: PaymentStatus.OVERDUE },
      }
    );

    if (overdueResult.modifiedCount > 0) {
      logger.info(`Scheduler: Marked ${overdueResult.modifiedCount} bookings as OVERDUE.`);
    }

    // 2. Transition to CANCELLED (Auto-Cancellation)
    // Find all bookings where:
    // - bookingStatus is RESERVED
    // - paymentStatus is PENDING, PARTIAL, DEPOSIT_PAID, or OVERDUE
    // - autoCancellationDate is set and past
    const toCancel = await Booking.find({
      bookingStatus: BookingStatus.RESERVED,
      paymentStatus: {
        $in: [
          PaymentStatus.PENDING,
          PaymentStatus.PARTIAL,
          PaymentStatus.DEPOSIT_PAID,
          PaymentStatus.OVERDUE,
        ],
      },
      autoCancellationDate: { $ne: null, $lt: now },
    });

    if (toCancel.length > 0) {
      for (const booking of toCancel) {
        booking.bookingStatus = BookingStatus.CANCELLED;
        booking.paymentStatus = PaymentStatus.CANCELLED;
        booking.cancellationReason = 'Auto-cancelled due to payment deadline expiration.';
        await booking.save();
        logger.info(
          `Scheduler: Auto-cancelled booking ${booking._id} due to unpaid balance expiration.`
        );
      }
    }
  } catch (error) {
    logger.error('Scheduler: Error running overdue and cancellation checks: ' + error);
  }
};

export const startScheduler = () => {
  // Run once immediately on start
  runOverdueAndCancellationCheck();

  // Run every 10 minutes (600,000 ms)
  const intervalMs = 10 * 60 * 1000;
  setInterval(runOverdueAndCancellationCheck, intervalMs);
  logger.info('Scheduler: Started background overdue and auto-cancellation checker.');
};
