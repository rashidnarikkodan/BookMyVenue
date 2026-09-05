import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  XCircle,
  Loader2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Printer,
  ExternalLink,
  Building2,
  Mail,
  Phone,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  'reserved+pending': {
    label: 'Pending Payment',
    color: 'text-warning bg-warning/10 border-warning/30',
    icon: Clock,
  },
  'reserved+partial': {
    label: 'Deposit Paid',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Clock,
  },
  'reserved+deposit_paid': {
    label: 'Deposit Paid',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    icon: Clock,
  },
  'reserved+overdue': {
    label: 'Payment Overdue',
    color: 'text-error bg-error/10 border-error/30',
    icon: AlertTriangle,
  },
  'confirmed+paid': {
    label: 'Confirmed',
    color: 'text-success bg-success/10 border-success/30',
    icon: CheckCircle2,
  },
  'completed+paid': {
    label: 'Completed',
    color: 'text-info bg-info/10 border-info/30',
    icon: CheckCircle2,
  },
  'cancelled+cancelled': {
    label: 'Cancelled',
    color: 'text-error bg-error/10 border-error/30',
    icon: XCircle,
  },
  'expired+cancelled': {
    label: 'Expired',
    color: 'text-error bg-error/10 border-error/30',
    icon: XCircle,
  },
};

const fmtFull = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fmtDate = (date: string | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

interface SharedBookingDetailsProps {
  booking: any;
  role: 'user' | 'owner';
  actionLoading?: boolean;
  onCancel?: (reason?: string) => void;
  onPayBalance?: (amount?: number) => void;
  backUrl: string;
  backText: string;
}

export default function SharedBookingDetails({
  booking,
  role,
  actionLoading = false,
  onCancel,
  onPayBalance,
  backUrl,
  backText,
}: SharedBookingDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Flexible balance payment state
  const [payOption, setPayOption] = useState<'full' | 'custom'>('full');
  const [customPayAmount, setCustomPayAmount] = useState<string>('');

  const remainingBalance = booking.remainingBalance || 0;
  const parsedCustom = parseFloat(customPayAmount);
  const effectivePayAmount =
    payOption === 'full'
      ? remainingBalance
      : !isNaN(parsedCustom) && parsedCustom > 0
      ? Math.min(remainingBalance, Math.round(parsedCustom))
      : remainingBalance;

  const isValidCustom =
    payOption === 'full' ||
    (!isNaN(parsedCustom) && parsedCustom >= 1 && parsedCustom <= remainingBalance);

  const balanceAfter = Math.max(0, remainingBalance - effectivePayAmount);

  const statusKey = `${booking.bookingStatus?.toLowerCase()}+${booking.paymentStatus?.toLowerCase()}`;
  const status = statusConfig[statusKey] ?? {
    label: booking.bookingStatus?.toUpperCase() || 'UNKNOWN',
    color: 'text-foreground/70 bg-muted/20 border-border',
    icon: Clock,
  };
  const StatusIcon = status.icon;

  const bookingStatusLower = booking.bookingStatus?.toLowerCase();
  const paymentStatusLower = booking.paymentStatus?.toLowerCase();

  const isPending = bookingStatusLower === 'pending' && paymentStatusLower === 'pending';
  const isPartial =
    (Number(booking.remainingBalance) > 0 || ['partial', 'deposit_paid', 'overdue'].includes(paymentStatusLower)) &&
    ['reserved', 'pending'].includes(bookingStatusLower) &&
    paymentStatusLower !== 'paid';

  const isCancellable =
    booking.isCancellable ||
    ['reserved', 'pending', 'confirmed'].includes(bookingStatusLower);

  const venue = booking.venue;
  const imageUrl = venue?.images?.[0] || venue?.imageUrl || null;
  const confirmationId = booking.bookingId || booking._id || booking.id;

  const startMs = new Date(booking.startDateTime).getTime();
  const endMs = new Date(booking.endDateTime).getTime();
  const durationHours =
    !isNaN(startMs) && !isNaN(endMs) ? Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60))) : 1;

  const handleCopyId = () => {
    navigator.clipboard.writeText(confirmationId);
    setCopied(true);
    toast.success('Confirmation ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    if (onCancel) onCancel(cancelReason || 'Cancelled by user');
  };

  const mapSearchUrl = venue?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${venue.name}, ${venue.address.street || ''}, ${venue.address.city || ''}, ${venue.address.state || ''}`
      )}`
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Full-width stretched wrapper matching marketplace layout */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8 print:p-0 print:max-w-full">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5 print:hidden">
          <div className="flex items-center gap-4">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>{backText}</span>
            </Link>

            <span className="hidden sm:inline-block text-border">|</span>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference:</span>
              <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-surface border border-border/60 text-foreground">
                {confirmationId}
              </span>
              <button
                onClick={handleCopyId}
                title="Copy Reference ID"
                className="p-1 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Copy size={13} className={copied ? 'text-success' : ''} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyId}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/60 bg-surface text-xs font-bold text-foreground hover:bg-surface/80 transition-all cursor-pointer shadow-2xs"
            >
              <Copy size={13} className={copied ? 'text-success' : 'text-primary'} />
              {copied ? 'Copied' : 'Copy ID'}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/60 bg-surface text-xs font-bold text-foreground hover:bg-surface/80 transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-primary" />
              <span>Print Receipt</span>
            </button>

            {mapSearchUrl && (
              <a
                href={mapSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/60 bg-surface text-xs font-bold text-foreground hover:bg-surface/80 transition-all cursor-pointer shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-primary" />
                <span>Directions</span>
              </a>
            )}
          </div>
        </div>

        {/* Grand Hero Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-border/40 bg-card shadow-xl shadow-black/10">
          <div className="relative h-60 sm:h-72 md:h-80 w-full bg-surface">
            {imageUrl ? (
              <img src={imageUrl} alt={venue?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-muted-foreground/40">
                <Building2 size={72} className="stroke-[1]" />
              </div>
            )}

            {/* Gradient Scrims for depth and contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Top Status & Reference Badges */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg border ${status.color}`}
              >
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>

              {venue?._id && (
                <Link
                  to={`/venues/${venue._id}`}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all"
                >
                  <span>Explore Venue Listing</span>
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>

            {/* Bottom Venue Meta Info */}
            <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-8 right-5 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div className="space-y-1.5 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-md">
                  {venue?.name || 'Venue Booking'}
                </h1>
                {venue?.address && (
                  <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium flex items-center gap-1.5 drop-shadow-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      {[venue.address.street, venue.address.city, venue.address.state]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </p>
                )}
              </div>

              {/* Reference ID Pill on mobile */}
              <div className="sm:hidden">
                <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white">
                  Ref: {confirmationId.substring(0, 12)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Primary Content (8 cols) vs Right Financials (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 xl:gap-10 items-start">
          {/* Left Column: Timeline, Contact, Venue Notes */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            {/* 1. Schedule & Timeline Card */}
            <div className="bg-surface/50 border border-border/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      Reservation Schedule
                    </h2>
                    <p className="text-xs text-muted-foreground">Confirmed event date, time and duration</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {durationHours} Hour{durationHours > 1 ? 's' : ''} Session
                  </span>
                </div>
              </div>

              {/* Start & End Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-background/80 rounded-2xl p-5 border border-border/60 space-y-2">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" /> Check In (Start)
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground block">
                    {fmtFull(booking.startDateTime)}
                  </span>
                </div>

                <div className="bg-background/80 rounded-2xl p-5 border border-border/60 space-y-2">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
                    <Clock size={12} className="text-primary" /> Check Out (End)
                  </span>
                  <span className="text-base sm:text-lg font-black text-foreground block">
                    {fmtFull(booking.endDateTime)}
                  </span>
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="flex flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-2 bg-background/90 border border-border/60 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-foreground">
                  <Clock size={16} className="text-primary" />
                  <span>Duration: {durationHours} Hour{durationHours > 1 ? 's' : ''}</span>
                </div>

                <div className="flex items-center gap-2 bg-background/90 border border-border/60 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-foreground">
                  <Users size={16} className="text-primary" />
                  <span>Attendees: {booking.guests || 1} Guests</span>
                </div>
              </div>
            </div>

            {/* 2. Customer Contact Information Card */}
            <div className="bg-surface/50 border border-border/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    Primary Contact Info
                  </h2>
                  <p className="text-xs text-muted-foreground">Organizer details for venue communications</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/80 rounded-2xl p-5 border border-border/60 space-y-1.5 min-w-0">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={12} className="text-primary" /> Contact Name
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground block truncate" title={booking.contactName || booking.user?.fullName}>
                    {booking.contactName || booking.user?.fullName || 'N/A'}
                  </span>
                </div>

                <div className="bg-background/80 rounded-2xl p-5 border border-border/60 space-y-1.5 min-w-0">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={12} className="text-primary" /> Email Address
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground block break-all" title={booking.contactEmail || booking.user?.email}>
                    {booking.contactEmail || booking.user?.email || 'N/A'}
                  </span>
                </div>

                <div className="bg-background/80 rounded-2xl p-5 border border-border/60 space-y-1.5 min-w-0">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} className="text-primary" /> Phone Number
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-foreground block truncate">
                    {booking.contactPhone || 'N/A'}
                  </span>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="bg-background/80 rounded-2xl p-5 border border-border/50 space-y-2">
                  <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                    Special Instructions / Requests
                  </span>
                  <p className="text-sm font-medium text-foreground/90 leading-relaxed bg-surface/40 p-3.5 rounded-xl border border-border/40 italic">
                    "{booking.specialRequests}"
                  </p>
                </div>
              )}

              {booking.guestFileName && (
                <div className="bg-background/80 rounded-2xl p-4 border border-border/50 flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-success shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-foreground block">Bulk Guest Roster Attached</span>
                    <span className="text-muted-foreground">{booking.guestFileName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Venue Details Card & Quick Action */}
            {venue && (
              <div className="bg-surface/30 border border-border/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{venue.name}</span>
                    <span className="text-xs text-muted-foreground font-medium">Need venue rules, parking, or amenities information?</span>
                  </div>
                </div>

                <Link
                  to={`/venues/${venue._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface/80 border border-border/60 text-xs font-bold text-primary transition-all shrink-0 cursor-pointer"
                >
                  <span>View Venue Listing</span>
                  <ExternalLink size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Financial Summary & Flexible Payment Card */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6 lg:sticky lg:top-24">
              <div className="border-b border-border/40 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                    Financial Summary
                  </h3>
                  <p className="text-xs text-muted-foreground">Payment breakdown & balance</p>
                </div>
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <CreditCard size={20} />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center bg-surface/40 p-3.5 rounded-2xl border border-border/40">
                  <span className="text-muted-foreground font-medium">Total Booking Amount</span>
                  <span className="text-lg font-black text-foreground">
                    ₹{booking.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-surface/40 p-3.5 rounded-2xl border border-border/40">
                  <span className="text-muted-foreground font-medium">Amount Paid</span>
                  <span className="text-base font-black text-success">
                    ₹{booking.amountPaid?.toLocaleString('en-IN')}
                  </span>
                </div>

                {booking.remainingBalance > 0 && (
                  <div className="flex justify-between items-center bg-warning/10 p-4 rounded-2xl border border-warning/30">
                    <span className="text-warning font-extrabold text-sm uppercase tracking-wide">Balance Due</span>
                    <span className="text-xl font-black text-warning">
                      ₹{booking.remainingBalance?.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {booking.remainingPaymentDueDate && isPartial && (
                  <div className="bg-warning/10 border border-warning/20 p-3.5 rounded-2xl text-xs text-warning font-semibold space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="shrink-0" />
                      <span>Remaining balance due by {fmtDate(booking.remainingPaymentDueDate)} (EOD)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {role === 'user' && (isPending || isPartial || isCancellable) && (
                <div className="space-y-4 pt-2">
                  {isPartial && onPayBalance && (
                    <div className="bg-surface/80 border border-border/80 rounded-3xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-primary" /> Pay Due Money
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Pay all at once or choose a flexible partial amount.
                          </p>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Due: ₹{remainingBalance.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Mode Toggle: Full vs Custom */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-background rounded-2xl border border-border/60">
                        <button
                          type="button"
                          onClick={() => {
                            setPayOption('full');
                            setCustomPayAmount('');
                          }}
                          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            payOption === 'full'
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Pay All at Once (₹{remainingBalance.toLocaleString('en-IN')})
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPayOption('custom');
                            if (!customPayAmount) {
                              setCustomPayAmount(String(Math.max(1, Math.round(remainingBalance / 2))));
                            }
                          }}
                          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            payOption === 'custom'
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Flexible / Partial
                        </button>
                      </div>

                      {/* If Custom Mode Selected */}
                      {payOption === 'custom' && (
                        <div className="space-y-3 pt-1">
                          {/* Quick preset chips */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-semibold text-muted-foreground">Quick select:</span>
                            {[0.25, 0.5, 0.75, 1.0].map((ratio) => {
                              const chipAmount = Math.max(1, Math.round(remainingBalance * ratio));
                              const isSelected = parsedCustom === chipAmount;
                              return (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => setCustomPayAmount(String(chipAmount))}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary/20 border-primary text-primary'
                                      : 'border-border/60 bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                                  }`}
                                >
                                  {ratio * 100}% (₹{chipAmount.toLocaleString('en-IN')})
                                </button>
                              );
                            })}
                          </div>

                          {/* Amount input */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                              <span>Enter Amount to Pay</span>
                              <span className="text-[11px] text-muted-foreground font-mono">
                                Min: ₹1 • Max: ₹{remainingBalance.toLocaleString('en-IN')}
                              </span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground">
                                ₹
                              </span>
                              <input
                                type="number"
                                min={1}
                                max={remainingBalance}
                                value={customPayAmount}
                                onChange={(e) => setCustomPayAmount(e.target.value)}
                                placeholder={`e.g. ${Math.round(remainingBalance / 2)}`}
                                className="w-full pl-8 pr-4 py-2.5 bg-background border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm font-bold text-foreground outline-none transition-all"
                              />
                            </div>
                            {customPayAmount && !isValidCustom && (
                              <p className="text-[11px] text-error font-medium">
                                {parsedCustom < 1
                                  ? 'Amount must be at least ₹1.'
                                  : `Amount cannot exceed remaining due balance of ₹${remainingBalance.toLocaleString('en-IN')}.`}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Projection summary card */}
                      <div className="bg-background/80 rounded-2xl p-4 border border-border/50 text-xs space-y-2">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Amount Paying Now:</span>
                          <span className="font-extrabold text-foreground text-sm">
                            ₹{effectivePayAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Remaining Balance After:</span>
                          <span className={`font-extrabold text-sm ${balanceAfter === 0 ? 'text-success' : 'text-foreground'}`}>
                            ₹{balanceAfter.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {balanceAfter === 0 ? (
                          <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-success border-t border-border/40">
                            <CheckCircle2 size={14} className="shrink-0" />
                            <span>This payment will completely settle your balance and Confirm the booking!</span>
                          </div>
                        ) : (
                          <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-warning border-t border-border/40">
                            <Clock size={14} className="shrink-0" />
                            <span>
                              Remaining ₹{balanceAfter.toLocaleString('en-IN')} due before {fmtDate(booking.remainingPaymentDueDate)} (EOD).
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={() => onPayBalance(effectivePayAmount)}
                        disabled={actionLoading || !isValidCustom || effectivePayAmount <= 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/95 text-white font-black text-base rounded-2xl transition-all shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                        {actionLoading
                          ? 'Opening Checkout...'
                          : `Pay ₹${effectivePayAmount.toLocaleString('en-IN')}`}
                      </button>
                    </div>
                  )}

                  {onCancel && (isPending || isCancellable) && booking.bookingStatus !== 'cancelled' && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border border-error/30 text-error hover:bg-error/10 font-extrabold text-sm rounded-2xl transition-all cursor-pointer disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {actionLoading ? 'Processing...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              )}

              {/* Help & Support Info */}
              <div className="pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                <HelpCircle size={15} className="shrink-0 text-primary" />
                <span>Questions about this booking? Contact support anytime.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card border border-border/60 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1.5">
              <h3 className="text-xl font-extrabold text-foreground tracking-tight">Cancel Reservation</h3>
              <p className="text-xs text-muted-foreground font-medium">
                Are you sure you want to cancel your booking for <span className="text-foreground font-bold">{venue?.name}</span>?
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="E.g., Event was rescheduled, plans changed..."
                className="w-full min-h-[100px] p-3.5 text-sm bg-surface border border-border/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={actionLoading}
                className="px-5 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Keep Booking
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-error hover:bg-error/95 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
