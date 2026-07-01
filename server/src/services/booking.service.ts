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
  return BookingScenario.IMMEDIATE;
};

/**
 * Calculates the remaining payment due date based on booking lead time.
 * Uses UTC-based calculations.
 * Core rule:
 *   leadTimeDays = (eventDate - bookingDate) in days
 *   If leadTimeDays >= 7 (Normal Booking):
 *     remainingPaymentDueDate = eventDate - (leadTimeDays * cancellationFactor)
 *   If leadTimeDays < 7 (Short Notice Booking):
 *     remainingPaymentDueDate = bookingDate
 *     isImmediatePaymentRequired = true
 */
export const calculateRemainingDueDate = (
  bookingDate: Date,
  eventDate: Date,
  cancellationFactor: number = 0.5
) => {
  const bookingTime = bookingDate.getTime();
  const eventTime = eventDate.getTime();
  const diffMs = eventTime - bookingTime;
  const leadTimeDays = diffMs / (1000 * 60 * 60 * 24);

  if (leadTimeDays < 0) {
    throw new AppError('Event date cannot be before booking date', HTTP_STATUS.BAD_REQUEST);
  }

  let remainingPaymentDueDate: Date;
  let isImmediatePaymentRequired: boolean;

  if (leadTimeDays < RESERVATION_POLICY.ADVANCE_THRESHOLD_DAYS) {
    // CASE 2: Short Notice Booking
    remainingPaymentDueDate = new Date(bookingTime);
    isImmediatePaymentRequired = true;
  } else {
    // CASE 1: Normal Booking
    isImmediatePaymentRequired = false;
    const daysToSubtract = leadTimeDays * cancellationFactor;
    const dueTime = eventTime - (daysToSubtract * 24 * 60 * 60 * 1000);
    // Clamp to ensure it doesn't fall before bookingDate or after eventDate
    const clampedTime = Math.max(bookingTime, Math.min(eventTime, dueTime));
    remainingPaymentDueDate = new Date(clampedTime);
    // Round to 11:59 PM of the target day for clean display
    remainingPaymentDueDate.setHours(23, 59, 59, 999);
  }

  // Calculate autoCancellationDate
  let autoCancellationDate: Date;
  if (isImmediatePaymentRequired) {
    autoCancellationDate = new Date(bookingTime + 30 * 60 * 1000); // 30 minutes
  } else {
    autoCancellationDate = new Date(
      remainingPaymentDueDate.getTime() + RESERVATION_POLICY.GRACE_PERIOD_HOURS * 60 * 60 * 1000
    );
  }

  return {
    remainingPaymentDueDate,
    autoCancellationDate,
    leadTimeDays,
    isImmediatePaymentRequired,
  };
};

// ── Public API ────────────────────────────────────────────────

export const getBookingByVenueId = async (id: string) => {
  return bookingRepo.getBookingByVenueId(id);
};

/**
 * Standalone service to calculate booking quotes (pricing breakdown, scenarios, and deposits).
 * This ensures the backend has sole ownership of pricing calculations.
 */
export const calculateQuoteService = async (
  venueId: string,
  startDateTime: string | Date,
  endDateTime: string | Date
) => {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (start >= end) {
    throw new AppError('End date must be after the start date', HTTP_STATUS.BAD_REQUEST);
  }
  if (start < new Date()) {
    throw new AppError('Past dates are not allowed', HTTP_STATUS.BAD_REQUEST);
  }

  // Fetch venue pricing
  const availability: IAvailability | null = await getAvailabilityByVenueId(venueId);
  if (!availability) {
    throw new AppError('Venue not available to book', HTTP_STATUS.NOT_FOUND);
  }

  // Calculate total amount (base + GST + platform fee)
  const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  const baseAmount = durationInHours * availability.pricePerHour;
  const gst = baseAmount * RESERVATION_POLICY.GST_PERCENTAGE;
  const platformFee = baseAmount * RESERVATION_POLICY.PLATFORM_FEE_PERCENTAGE;
  const totalAmount = Math.round(baseAmount + gst + platformFee);

  // Determine scenario
  const scenario = determineScenario(start);

  // Calculate deposit and balance
  const reservationDeposit =
    scenario === BookingScenario.IMMEDIATE
      ? totalAmount
      : Math.round(totalAmount * RESERVATION_POLICY.DEPOSIT_PERCENTAGE);

  const remainingBalance = totalAmount - reservationDeposit;

  // Calculate due date details
  const now = new Date();
  const deadlineDetails = calculateRemainingDueDate(now, start, 0.5);

  return {
    durationInHours,
    baseAmount,
    gst,
    platformFee,
    totalAmount,
    bookingScenario: scenario,
    reservationDeposit,
    remainingBalance,
    remainingPaymentDueDate: deadlineDetails.remainingPaymentDueDate,
    autoCancellationDate: deadlineDetails.autoCancellationDate,
    isImmediatePaymentRequired: deadlineDetails.isImmediatePaymentRequired,
  };
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
  const start = new Date(payload.startDateTime);
  const end = new Date(payload.endDateTime);

  // Overlap check
  const hasOverlapping = await bookingRepo.hasOverlappingBooking(
    payload.venueId,
    start,
    end
  );
  if (hasOverlapping) {
    throw new AppError('Venue unavailable at the selected time', HTTP_STATUS.CONFLICT);
  }

  // Get pricing details from backend-owned quote service
  const quote = await calculateQuoteService(payload.venueId, start, end);

  // Save booking to database
  const booking = await bookingRepo.createBooking(userId, payload, {
    totalAmount: quote.totalAmount,
    reservationDeposit: quote.reservationDeposit,
    remainingBalance: quote.remainingBalance,
    bookingScenario: quote.bookingScenario,
    remainingPaymentDueDate: quote.remainingPaymentDueDate,
    autoCancellationDate: quote.autoCancellationDate,
    isImmediatePaymentRequired: quote.isImmediatePaymentRequired,
  });

  return { booking, razorpayChargeAmount: quote.reservationDeposit };
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
  const allowedStatuses = [PaymentStatus.PARTIAL, PaymentStatus.DEPOSIT_PAID, PaymentStatus.OVERDUE];
  if (!allowedStatuses.includes(booking.paymentStatus as PaymentStatus)) {
    throw new AppError(
      'Deposit must be paid before balance payment',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // ── 4. Check deadline hasn't expired ───────────────────
  if (
    booking.remainingPaymentDueDate &&
    new Date() > booking.remainingPaymentDueDate
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
 * Permanently deletes a booking that hasn't been paid yet (PENDING payment status).
 * Called on payment failure, modal dismiss without paying, or explicit user cancel.
 * Frees the reserved slot.
 */
export const deleteBookingService = async (
  userId: string,
  bookingId: string
) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    // Already deleted — treat as success (idempotent)
    return;
  }

  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }

  if (booking.paymentStatus !== PaymentStatus.PENDING) {
    throw new AppError(
      'Only unpaid bookings can be deleted',
      HTTP_STATUS.BAD_REQUEST
    );
  }

  await bookingRepo.deleteBookingById(bookingId);
};

export const getUserBookingsService = async (
  userId: string,
  page: number,
  limit: number,
  status?: string
) => {
  return await bookingRepo.findBookingsByUser(userId, page, limit, status);
};

export const getBookingByIdService = async (userId: string, bookingId: string) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw new AppError('Booking not found', HTTP_STATUS.NOT_FOUND);
  }
  if (booking.user._id.toString() !== userId) {
    throw new AppError('Unauthorized access to booking', HTTP_STATUS.UNAUTHORIZED);
  }
  return booking;
};
