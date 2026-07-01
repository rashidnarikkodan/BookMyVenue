import { useState } from 'react';
import { CreditCard, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '@/features/bookings/services/bookings.api';
import type { Booking } from '../../types';
import { BookingDetails } from './BookingDetails';
import { BookingPaymentInfo } from './BookingPaymentInfo';

interface BookingCardProps {
  booking: Booking;
  onCancelSuccess: () => void;
}

const BookingCard = ({ booking, onCancelSuccess }: BookingCardProps) => {
  const [cancelling, setCancelling] = useState(false);
  const [payingBalance, setPayingBalance] = useState(false);

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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayBalance = async () => {
    try {
      setPayingBalance(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please refresh and try again.');
        return;
      }

      // Create balance payment order
      const res = await bookingsApi.payBalance(booking.id);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to initiate balance payment.');
      }

      const { payment } = res.data;
      const { orderId, amount, currency } = payment;

      // Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'BookMyVenue',
        description: `Remaining Balance for ${booking.venue.name}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            setPayingBalance(true);
            const verifyRes = await bookingsApi.verifyBalancePayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
            });

            if (verifyRes.success) {
              toast.success('Remaining balance paid and booking fully confirmed!');
              onCancelSuccess();
            } else {
              toast.error(verifyRes.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || 'Failed to verify payment.');
          } finally {
            setPayingBalance(false);
          }
        },
        prefill: {
          name: booking.contactName,
          email: booking.contactEmail,
          contact: booking.contactPhone,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to checkout remaining balance.');
    } finally {
      setPayingBalance(false);
    }
  };

  const getStatusStyle = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'bg-warning/10 text-warning border-warning/20';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
    if (paymentStatus === 'overdue') {
      return 'bg-error/10 text-error border-error/20';
    }
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-info/10 text-info border-info/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'expired':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-foreground/75 border-border';
    }
  };

  const formatStatus = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'PENDING PAYMENT';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'RESERVED (DEPOSIT PAID)';
    }
    if (paymentStatus === 'overdue') {
      return 'OVERDUE';
    }
    return status.replace('_', ' ').toUpperCase();
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
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(booking.bookingStatus, booking.paymentStatus)}`}
          >
            {formatStatus(booking.bookingStatus, booking.paymentStatus)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Venue & Date Details */}
          <BookingDetails booking={booking} />

          {/* Payment Info / Countdown banner */}
          <BookingPaymentInfo booking={booking} />
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

          <div className="flex items-center gap-3">
            {booking.amountPaid > 0 && (
              <span className="text-[11px] font-semibold text-success bg-success/5 border border-success/15 px-2.5 py-1 rounded-lg">
                Paid: ₹{booking.amountPaid.toLocaleString('en-IN')}
              </span>
            )}

            <div>
              {booking.bookingStatus === 'reserved' && booking.paymentStatus === 'pending' ? (
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
              ) : booking.bookingStatus === 'reserved' && (booking.paymentStatus === 'partial' || booking.paymentStatus === 'overdue') ? (
                <button
                  onClick={handlePayBalance}
                  disabled={payingBalance}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
                >
                  {payingBalance ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay Balance
                    </>
                  )}
                </button>
              ) : (
                booking.amountPaid === 0 && (
                  <span className="text-[11px] font-medium text-foreground/40">
                    Unpaid
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
