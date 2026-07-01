import { HTTP_STATUS } from '@/constants/http';
import { BookingScenario, BookingStatus, PaymentStatus, RESERVATION_POLICY } from '@/constants/booking';
import { CreateBookingPayload } from '@/types/booking.types';
import { AppError } from '@/utils/AppError';
import { getAvailabilityByVenueId } from '@/repositories/availability.repository';
import { IAvailability } from '@/types/availability.types';
import * as bookingRepo from '@/repositories/booking.repository';
import { verifyPaymentSignature } from './razorpay.service';

// ── Helpers ───────────────────────────────────────────────────

/**
 * Determines the booking scenario based on how many days
 * are between today and the event start date.
 */
const determineScenario = (eventStart: Date): BookingScenario => {
  const now = new Date();
  const diffMs = eventStart.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > RESERVATION_POLICY.ADVANCE_THRESHOLD_DAYS) {
    return BookingScenario.ADVANCE;
  }
  if (diffDays >= RESERVATION_POLICY.SHORT_NOTICE_THRESHOLD_DAYS) {
    return BookingScenario.SHORT_NOTICE;
  }
  return BookingScenario.IMMEDIATE;
};

/**
 * Calculates the balance payment deadline based on the scenario.
 *   ADVANCE      → 1 day before the event start
 *   SHORT_NOTICE → 24 hours from now
 *   IMMEDIATE    → null (already fully paid)
 */
const calculateBalanceDeadline = (
  scenario: BookingScenario,
  eventStart: Date
): Date | null => {
  if (scenario === BookingScenario.ADVANCE) {
    const deadline = new Date(eventStart);
    deadline.setDate(deadline.getDate() - 1);
    return deadline;
  }
  if (scenario === BookingScenario.SHORT_NOTICE) {
    const deadline = new Date();
    deadline.setHours(
      deadline.getHours() + RESERVATION_POLICY.SHORT_NOTICE_PAYMENT_DEADLINE_HOURS
    );
    return deadline;
  }
  return null; // IMMEDIATE — no deadline, full payment at checkout
};

// ── Public API ────────────────────────────────────────────────

export const getBookingByVenueId = async (id: string) => {
  return bookingRepo.getBookingByVenueId(id);
};

/**
 * Creates a new booking using the reservation deposit model.
 *
 * Returns the saved booking document along with the amount that
 * should be charged via Razorpay right now (deposit or full).
 */
export const createBookingService = async (
  userId: string,
  payload: CreateBookingPayload
) => {
  // ── 1. Validate dates ──────────────────────────────────
  const start = new Date(payload.startDateTime);
  const end = new Date(payload.endDateTime);

  if (start >= end) {
    throw new AppError('End date must be after the start date', HTTP_STATUS.BAD_REQUEST);
  }
  if (start < new Date()) {
    throw new AppError('Past dates are not allowed', HTTP_STATUS.BAD_REQUEST);
  }

  // ── 2. Overlap check ───────────────────────────────────
  const hasOverlapping = await bookingRepo.hasOverlappingBooking(
    payload.venueId,
    start,
    end
  );
  if (hasOverlapping) {
    throw new AppError('Venue unavailable at the selected time', HTTP_STATUS.CONFLICT);
  }

  // ── 3. Fetch venue pricing ─────────────────────────────
  const availability: IAvailability | null = await getAvailabilityByVenueId(
    payload.venueId
  );
  if (!availability) {
    throw new AppError('Venue not available to book', HTTP_STATUS.NOT_FOUND);
  }

  // ── 4. Calculate total amount (base + GST + platform fee)
  const durationInHours =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const baseAmount = durationInHours * availability.pricePerHour;
  const gst = baseAmount * RESERVATION_POLICY.GST_PERCENTAGE;
  const platformFee = baseAmount * RESERVATION_POLICY.PLATFORM_FEE_PERCENTAGE;
  const totalAmount = Math.round(baseAmount + gst + platformFee);

  // ── 5. Determine booking scenario ──────────────────────
  const scenario = determineScenario(start);

  // ── 6. Calculate deposit & balance ─────────────────────
  const reservationDeposit =
    scenario === BookingScenario.IMMEDIATE
      ? totalAmount
      : Math.round(totalAmount * RESERVATION_POLICY.DEPOSIT_PERCENTAGE);

  const remainingBalance = totalAmount - reservationDeposit;

  // ── 7. Calculate balance payment deadline ──────────────
  const balancePaymentDeadline = calculateBalanceDeadline(scenario, start);

  // ── 8. Razorpay charge amount ──────────────────────────
  //    For ADVANCE & SHORT_NOTICE → charge the 20% deposit
  //    For IMMEDIATE → charge 100%
  const razorpayChargeAmount = reservationDeposit;

  // ── 9. Save booking to database ────────────────────────
  const booking = await bookingRepo.createBooking(userId, payload, {
    totalAmount,
    reservationDeposit,
    remainingBalance,
    bookingScenario: scenario,
    balancePaymentDeadline,
  });

  return { booking, razorpayChargeAmount };
};

/**
 * Verifies the Razorpay payment signature after the customer
 * pays the reservation deposit (or full amount for IMMEDIATE).
 */
export const verifyAndConfirmDepositService = async (
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) => {
  // ── 1. Verify Razorpay signature ───────────────────────
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new AppError(
      'Payment signature verification failed',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // ── 2. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 3. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── 4. Update booking based on scenario ────────────────
  if (booking.bookingScenario === BookingScenario.IMMEDIATE) {
    // Full payment — mark as CONFIRMED + PAID
    return bookingRepo.confirmFullPayment(bookingId, booking.totalAmount);
  }

  // Deposit payment — mark as RESERVED + DEPOSIT_PAID
  return bookingRepo.confirmDepositPayment(bookingId, booking.reservationDeposit);
};

/**
 * Processes the remaining balance payment for RESERVED bookings.
 * Called when the user clicks "Pay Balance" on their bookings page.
 */
export const payBalanceService = async (userId: string, bookingId: string) => {
  // ── 1. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 2. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── 3. Status check ────────────────────────────────────
  if (booking.bookingStatus !== BookingStatus.RESERVED) {
    throw new AppError(
      'Only reserved bookings can have balance paid',
      HTTP_STATUS.BAD_REQUEST
    );
  }
  if (booking.paymentStatus !== PaymentStatus.DEPOSIT_PAID) {
    throw new AppError(
      'Deposit must be paid before balance payment',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // ── 4. Check deadline hasn't expired ───────────────────
  if (
    booking.balancePaymentDeadline &&
    new Date() > booking.balancePaymentDeadline
  ) {
    throw new AppError(
      'Balance payment deadline has passed',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // ── 5. Return the remaining balance for Razorpay order ─
  return {
    booking,
    razorpayChargeAmount: booking.remainingBalance,
  };
};

/**
 * Verifies the Razorpay payment for the balance and confirms
 * the booking fully.
 */
export const verifyBalancePaymentService = async (
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) => {
  // ── 1. Verify Razorpay signature ───────────────────────
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new AppError(
      'Payment signature verification failed',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // ── 2. Find the booking ────────────────────────────────
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  // ── 3. Ownership check ─────────────────────────────────
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  // ── 4. Mark as fully paid ──────────────────────────────
  return bookingRepo.confirmFullPayment(bookingId, booking.totalAmount);
};

/**
 * Cancels a booking that is still in PENDING payment status
 * (before Razorpay deposit is confirmed).
 */
export const cancelPendingBookingService = async (
  userId: string,
  bookingId: string
) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }

  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  if (booking.paymentStatus !== PaymentStatus.PENDING) {
    throw new AppError(
      'Only pending bookings can be cancelled',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await bookingRepo.deleteBookingById(bookingId);
};
