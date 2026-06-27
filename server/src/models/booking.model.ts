import mongoose, { Schema } from 'mongoose';
import { BookingStatus, PaymentMethod, PaymentStatus } from '../constants/booking';

const bookingSchema = new Schema(
  {
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    startDateTime: {
      type: Date,
      required: true,
    },

    endDateTime: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    contactName: {
      type: String,
      required: true,
      trim: true,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    specialRequests: {
      type: String,
      default: '',
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING_PAYMENT,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
