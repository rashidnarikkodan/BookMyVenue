import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Users, CreditCard,
  RefreshCw, XCircle, Loader2, CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { bookingsApi } from '../services/bookings.api';
import { Loading } from '@/shared/components/ui';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  'reserved+pending':    { label: 'Pending Payment', color: 'text-warning bg-warning/10 border-warning/20', icon: Clock },
  'reserved+partial':    { label: 'Deposit Paid',    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Clock },
  'reserved+deposit_paid':{ label: 'Deposit Paid',   color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', icon: Clock },
  'reserved+overdue':    { label: 'Overdue',         color: 'text-error bg-error/10 border-error/20', icon: AlertTriangle },
  'confirmed+paid':      { label: 'Confirmed',       color: 'text-success bg-success/10 border-success/20', icon: CheckCircle2 },
  'completed+paid':      { label: 'Completed',       color: 'text-info bg-info/10 border-info/20', icon: CheckCircle2 },
  'cancelled+cancelled': { label: 'Cancelled',       color: 'text-error bg-error/10 border-error/20', icon: XCircle },
  'expired+cancelled':   { label: 'Expired',         color: 'text-error bg-error/10 border-error/20', icon: XCircle },
};

const fmt = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const fmtDate = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

const loadRazorpay = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await bookingsApi.getBookingById(id);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        toast.error(res.message || 'Could not load booking.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to fetch booking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooking(); }, [id]);

  const openRazorpay = async (
    apiCall: () => Promise<any>,
    verifyCall: (response: any) => Promise<any>
  ) => {
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error('Razorpay SDK failed to load. Please refresh.'); return; }
    const res = await apiCall();
    if (!res.success || !res.data) throw new Error(res.message || 'Failed to create payment order.');
    const { payment, booking: updatedBooking } = res.data;
    let localHandled = false;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: payment.amount,
      currency: payment.currency,
      name: 'BookMyVenue',
      description: `Payment for ${updatedBooking?.venue?.name || 'Venue'}`,
      order_id: payment.orderId,
      handler: async (response: any) => {
        localHandled = true;
        try {
          setActionLoading(true);
          const vRes = await verifyCall(response);
          if (vRes.success) {
            toast.success('Payment confirmed!');
            fetchBooking();
          } else {
            toast.error(vRes.message || 'Verification failed.');
          }
        } catch (err: any) {
          toast.error(err?.response?.data?.message || err?.message || 'Verification failed.');
        } finally {
          setActionLoading(false);
        }
      },
      prefill: { name: booking?.contactName, email: booking?.contactEmail, contact: booking?.contactPhone },
      theme: { color: '#4f46e5' },
      modal: {
        ondismiss: () => {
          if (!localHandled) { toast.info('Payment cancelled.'); setActionLoading(false); }
        },
      },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (r: any) => {
      localHandled = true;
      toast.error(`Payment failed: ${r.error?.description || 'Unknown error'}. You can retry.`);
      setActionLoading(false);
    });
    rzp.open();
  };

  const handlePayBalance = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await openRazorpay(
        () => bookingsApi.payBalance(booking._id),
        (r) => bookingsApi.verifyBalancePayment({
          razorpay_payment_id: r.razorpay_payment_id,
          razorpay_order_id: r.razorpay_order_id,
          razorpay_signature: r.razorpay_signature,
          bookingId: booking._id,
        })
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not open payment.');
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking || !window.confirm('Cancel this booking and release the slot?')) return;
    setActionLoading(true);
    try {
      const res = await bookingsApi.deleteBooking(booking._id);
      if (res.success) {
        toast.success('Booking cancelled.');
        navigate('/account/bookings');
      } else {
        toast.error(res.message || 'Could not cancel booking.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Cancel failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading text="Loading booking details…" fullPage />;

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center p-6">
        <AlertTriangle className="w-12 h-12 text-error/70" />
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-sm text-foreground/60 max-w-xs">This booking does not exist or you don't have access to it.</p>
        <Link to="/account/bookings" className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all">
          My Bookings
        </Link>
      </div>
    );
  }

  const statusKey = `${booking.bookingStatus?.toLowerCase()}+${booking.paymentStatus?.toLowerCase()}`;
  const status = statusConfig[statusKey] ?? { label: booking.bookingStatus?.toUpperCase(), color: 'text-foreground/60 bg-muted/10 border-border', icon: Clock };
  const StatusIcon = status.icon;

  const isPending = booking.bookingStatus === 'pending' && booking.paymentStatus === 'pending';
  const isPartial = booking.bookingStatus === 'reserved' &&
    ['partial', 'deposit_paid', 'overdue'].includes(booking.paymentStatus?.toLowerCase());
  const canCancel = isPending;

  const venue = booking.venue;
  const imageUrl = venue?.images?.[0] || venue?.imageUrl || null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Back nav */}
        <Link to="/account/bookings" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Bookings
        </Link>

        {/* Venue banner */}
        <div className="rounded-3xl overflow-hidden border border-border bg-surface shadow-sm">
          {imageUrl ? (
            <img src={imageUrl} alt={venue?.name} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-muted/20 flex items-center justify-center text-foreground/30 text-sm">No image</div>
          )}
          <div className="p-5 sm:p-6 space-y-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-foreground">{venue?.name}</h1>
                {venue?.address && (
                  <p className="text-sm text-foreground/60 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {venue.address.street}, {venue.address.city}
                  </p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border flex-shrink-0 ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Booking Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Check In</p>
                  <p className="font-semibold text-foreground">{fmt(booking.startDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Check Out</p>
                  <p className="font-semibold text-foreground">{fmt(booking.endDateTime)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold">Guests</p>
                  <p className="font-semibold text-foreground">{booking.guests} Attendees</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Payment Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Total Amount</span>
                <span className="font-bold text-foreground">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Amount Paid</span>
                <span className="font-bold text-success">₹{booking.amountPaid?.toLocaleString('en-IN')}</span>
              </div>
              {booking.remainingBalance > 0 && (
                <div className="flex justify-between border-t border-border/60 pt-2">
                  <span className="text-foreground/60">Balance Due</span>
                  <span className="font-bold text-warning">₹{booking.remainingBalance?.toLocaleString('en-IN')}</span>
                </div>
              )}
              {booking.remainingPaymentDueDate && isPartial && (
                <p className="text-[11px] text-foreground/50 pt-1">Due by {fmtDate(booking.remainingPaymentDueDate)} (EOD)</p>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation ID */}
        <div className="rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Confirmation ID</p>
          <p className="font-mono text-sm font-bold text-foreground break-all">{booking._id}</p>
        </div>

        {/* Actions */}
        {(isPending || isPartial) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {isPending && (
              <button onClick={handleCancel} disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-error/30 text-error hover:bg-error/5 disabled:opacity-60 text-sm font-bold rounded-xl transition-all">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                {actionLoading ? 'Cancelling…' : 'Cancel Booking'}
              </button>
            )}
            {isPartial && (
              <button onClick={handlePayBalance} disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-md">
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                {actionLoading ? 'Opening…' : 'Pay Remaining Balance'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
