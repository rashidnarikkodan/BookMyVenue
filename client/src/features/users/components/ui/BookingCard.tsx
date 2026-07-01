import { useState } from 'react';
import { MapPin, Users, Calendar, Clock, CreditCard, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '@/features/bookings/services/bookings.api';
import type { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess: () => void;
}

const BookingCard = ({ booking, onCancelSuccess }: BookingCardProps) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this pending booking?')) {
      return;
    }

    try {
      setCancelling(true);
      const res = await bookingsApi.cancelPendingBooking(booking.id);
      if (res.success) {
        toast.success('Booking cancelled successfully.');
        onCancelSuccess();
      } else {
        toast.error(res.message || 'Failed to cancel booking.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending_payment':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-info/10 text-info border-info/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-foreground/75 border-border';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-3xl border border-border bg-surface shadow-md overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      {/* Top Image / Status */}
      <div className="relative h-44 bg-zinc-900 overflow-hidden">
        {booking.venue.imageUrl ? (
          <img
            src={booking.venue.imageUrl}
            alt={booking.venue.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 text-foreground/45">
            No image available
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(booking.bookingStatus)}`}
          >
            {formatStatus(booking.bookingStatus)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue details */}
          <h3 className="text-lg font-bold text-foreground line-clamp-1">{booking.venue.name}</h3>
          <div className="flex items-center gap-1.5 text-xs text-foreground/60 mt-1">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{booking.venue.location}</span>
          </div>

          <div className="border-t border-border/60 my-4" />

          {/* Time & Dates */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <Calendar className="w-4 h-4 text-foreground/40" />
              <div>
                <span className="font-semibold">{formatDate(booking.startDateTime)}</span>
                {formatDate(booking.startDateTime) !== formatDate(booking.endDateTime) && (
                  <>
                    {' '}
                    - <span className="font-semibold">{formatDate(booking.endDateTime)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <Clock className="w-4 h-4 text-foreground/40" />
              <span>
                {formatTime(booking.startDateTime)} - {formatTime(booking.endDateTime)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <Users className="w-4 h-4 text-foreground/40" />
              <span>{booking.guests} guests</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-foreground/80">
              <CreditCard className="w-4 h-4 text-foreground/40" />
              <span className="capitalize">Payment: {booking.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">
              Total Price
            </p>
            <p className="text-base font-black text-primary">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            {booking.bookingStatus === 'pending_payment' ? (
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="px-4 py-2 border border-error/30 text-error hover:bg-error/5 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Booking
                  </>
                )}
              </button>
            ) : (
              <span className="text-[11px] font-medium text-foreground/40">
                Paid: ₹{booking.amountPaid.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
