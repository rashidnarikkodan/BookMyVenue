import Booking from '@/models/booking.model';
import { IBooking, CreateBookingPayload } from '@/types/booking.types';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@/constants/booking';
import mongoose from 'mongoose';

// ── Create ──────────────────────────────────────────────────

export const createBooking = async (
    userId: string,
    payload: CreateBookingPayload,
    totalAmount: number
): Promise<IBooking> => {
    const paymentStatus =
        payload.paymentMethod === PaymentMethod.CASH
            ? PaymentStatus.PENDING
            : PaymentStatus.PAID;

    const bookingStatus =
        payload.paymentMethod === PaymentMethod.CASH
            ? BookingStatus.CONFIRMED        // cash bookings are immediately confirmed
            : BookingStatus.CONFIRMED;

    const doc = await Booking.create({
        venue: new mongoose.Types.ObjectId(payload.venueId),
        user: new mongoose.Types.ObjectId(userId),
        startDateTime: new Date(payload.startDateTime),
        endDateTime: new Date(payload.endDateTime),
        guests: payload.guests,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        specialRequests: payload.specialRequests || '',
        paymentMethod: payload.paymentMethod,
        bookingStatus,
        paymentStatus,
        totalAmount,
        amountPaid: payload.paymentMethod === PaymentMethod.CASH ? 0 : totalAmount,
    });

    return doc as IBooking;
};

// ── Read ────────────────────────────────────────────────────

export const findBookingById = async (id: string): Promise<IBooking | null> => {
    return Booking.findById(id)
        .populate('venue', 'name address images')
        .populate('user', 'fullName email') as Promise<IBooking | null>;
};

export const getBookingByVenueId = async (
    id: string
): Promise<IBooking[] | null> => {
    const today = new Date();

    const filter = {
        venue: id,
        startDateTime: {
            $gte: today,
        },
    };

    return Booking.find(filter);
};

export const findBookingsByUser = async (
    userId: string,
    page: number,
    limit: number,
    status?: string
) => {
    const filter: Record<string, any> = { user: new mongoose.Types.ObjectId(userId) };
    if (status && status !== 'all') filter.bookingStatus = status;

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate('venue', 'name address images categoryId')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking.countDocuments(filter),
    ]);

    return {
        bookings,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

export const findBookingsByVenue = async (
    venueId: string,
    page: number,
    limit: number,
    status?: string
) => {
    const filter: Record<string, any> = { venue: new mongoose.Types.ObjectId(venueId) };
    if (status && status !== 'all') filter.bookingStatus = status;

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking.countDocuments(filter),
    ]);

    return {
        bookings,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

export const findAllBookings = async (
    page: number,
    limit: number,
    status?: string,
    venueId?: string
) => {
    const filter: Record<string, any> = {};
    if (status && status !== 'all') filter.bookingStatus = status;
    if (venueId) filter.venue = new mongoose.Types.ObjectId(venueId);

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate('venue', 'name address')
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking.countDocuments(filter),
    ]);

    return {
        bookings,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};

// ── Overlap check ───────────────────────────────────────────

/**
 * Returns true if an active booking exists for this venue that
 * overlaps with [startDateTime, endDateTime].
 */
export const hasOverlappingBooking = async (
    venueId: string,
    startDateTime: Date,
    endDateTime: Date,
    excludeBookingId?: string
): Promise<boolean> => {
    const filter: Record<string, any> = {
        venue: new mongoose.Types.ObjectId(venueId),
        bookingStatus: { $in: [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT] },
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime },
    };

    if (excludeBookingId) {
        filter._id = { $ne: new mongoose.Types.ObjectId(excludeBookingId) };
    }

    return (await Booking.countDocuments(filter)) > 0;
};

// ── Update ──────────────────────────────────────────────────

export const updateBookingStatus = async (
    id: string,
    bookingStatus: BookingStatus
): Promise<IBooking | null> => {
    return Booking.findByIdAndUpdate(id, { bookingStatus }, { new: true }) as Promise<IBooking | null>;
};

export const cancelBooking = async (
    id: string,
    cancellationReason: string
): Promise<IBooking | null> => {
    return Booking.findByIdAndUpdate(
        id,
        {
            bookingStatus: BookingStatus.CANCELLED,
            paymentStatus: PaymentStatus.REFUNDED,
            cancellationReason,
        },
        { new: true }
    ) as Promise<IBooking | null>;
};

export const updatePaymentStatus = async (
    id: string,
    paymentStatus: PaymentStatus,
    amountPaid?: number
): Promise<IBooking | null> => {
    const update: Record<string, any> = { paymentStatus };
    if (amountPaid !== undefined) update.amountPaid = amountPaid;
    return Booking.findByIdAndUpdate(id, update, { new: true }) as Promise<IBooking | null>;
};
