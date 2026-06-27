import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Printer, ExternalLink } from "lucide-react";
import type { Venue } from "@/features/venues/types/venues.types";
import type { Addon } from "../types/bookings.types";

interface BookingSuccessModalProps {
  successData: any;
  venue: Venue;
  startDateTime: string | null;
  endDateTime: string | null;
  guests: number;
  selectedAddons: Addon[];
  onClose: () => void;
}

export default function BookingSuccessModal({
  successData,
  venue,
  startDateTime,
  endDateTime,
  guests,
  selectedAddons,
  onClose,
}: BookingSuccessModalProps) {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pricing calculation logic
  const addonsTotal = selectedAddons.reduce((sum, a) => {
    const addonCost = a.priceType === "perHead" ? a.price * guests : a.price;
    return sum + addonCost;
  }, 0);

  const basePrice = venue.availability?.pricePerHour || 0;

  const duration = startDateTime && endDateTime
    ? Math.ceil((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 3600000)
    : 0;

  const subtotal = addonsTotal + basePrice * duration;
  const tax = Math.round(subtotal * 0.07);
  const grandTotal = subtotal + tax;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Glowing top line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-500 to-emerald-400" />
        
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-2">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Reservation Confirmed!
          </h2>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Your reservation has been locked in. We have sent a copy of the invoice to your registered email address.
          </p>
        </div>

        {/* Receipt Summary Card */}
        <div className="bg-background border border-border rounded-2xl p-4 text-xs space-y-3">
          <div className="flex justify-between border-b border-border/80 pb-2.5">
            <span className="text-muted font-semibold">CONFIRMATION ID</span>
            <span className="font-mono font-bold text-foreground text-sm tracking-wider">
              {successData._id}
            </span>
          </div>

          <div className="space-y-1.5 py-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide block">
              VENUE DETAILS
            </span>
            <span className="font-bold text-foreground block text-sm">{venue.name}</span>
            <span className="text-muted block">
              {venue.address.street}, {venue.address.city}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border/80 pt-2.5">
            <div>
              <span className="text-[9px] font-bold text-muted block uppercase">Check In</span>
              <span className="font-semibold text-foreground block mt-0.5">
                {formatDate(successData.startDateTime)}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-muted block uppercase">Guests</span>
              <span className="font-semibold text-foreground block mt-0.5">
                {successData.guests} Attendees
              </span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border/80 pt-2.5">
            <span className="text-muted">Payment Type</span>
            <span className="font-bold text-foreground capitalize">
              {successData.paymentMethod === "card" 
                ? "Credit Card" 
                : successData.paymentMethod === "upi" 
                ? "UPI Transfer" 
                : "Pay At Venue"}
            </span>
          </div>

          <div className="flex justify-between border-t border-border/80 pt-2.5 text-sm font-bold text-foreground">
            <span>Total Calculated</span>
            <span className="text-primary text-base font-extrabold">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex justify-center items-center gap-2 border border-border hover:border-foreground/30 bg-background text-foreground text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
          >
            <Printer size={14} /> Print Receipt
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="flex-1 inline-flex justify-center items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            Return Home
          </button>
        </div>
        
        <div className="text-center pt-1.5">
          <Link
            to="/account/bookings"
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
            onClick={onClose}
          >
            View My Bookings Dashboard <ExternalLink size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
