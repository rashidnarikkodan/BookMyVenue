import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Loader2, CreditCard, Wallet, Landmark } from "lucide-react";
import type { Venue } from "@/features/venues/types/venues.types";
import type { Addon } from "../types/bookings.types";

type Props = {
  venue: Venue | null;
  startDateTime: string | null;
  endDateTime: string | null;
  guests: number;
  selectedAddons: Addon[];
  paymentMethod: "card" | "upi" | "cash";
  paymentDetails: any;
  onPaymentMethodChange: (method: "card" | "upi" | "cash") => void;
  onPaymentDetailsChange: (details: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

const PricingSection: React.FC<Props> = ({
  venue,
  startDateTime,
  endDateTime,
  guests,
  selectedAddons,
  paymentMethod,
  paymentDetails,
  onPaymentMethodChange,
  onPaymentDetailsChange,
  onSubmit,
  isSubmitting,
}) => {
  const [duration, setDuration] = useState<number>(0);
  const [durationUnit, setDurationUnit] = useState<"hour" | "day">("day");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Suppress typescript unused variables warnings
  const _unusedRef = { paymentDetails, onPaymentDetailsChange };
  useEffect(() => {
    if (!_unusedRef) return;
  }, [_unusedRef]);

  const pricingUnit = "hour";
  const priceRate = venue?.availability?.pricePerHour || 0;

  useEffect(() => {
    setDurationUnit(pricingUnit);

    if (!startDateTime || !endDateTime) {
      setDuration(0);
      return;
    }

    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();

    if (isNaN(start) || isNaN(end) || end <= start) {
      setDuration(0);
      return;
    }

    const diffMs = end - start;
    if (pricingUnit === "hour") {
      const hrs = Math.ceil(diffMs / (1000 * 60 * 60));
      setDuration(hrs);
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setDuration(days);
    }
  }, [startDateTime, endDateTime, pricingUnit]);

  // Calculations
  const basePrice = duration * priceRate;
  
  const calculateAddonCost = (addon: Addon) => {
    if (addon.priceType === "perHead") {
      return addon.price * guests;
    }
    if (addon.priceType === "perHour") {
      return addon.price * (pricingUnit === "hour" ? duration : (duration * 24));
    }
    return addon.price;
  };

  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + calculateAddonCost(addon), 0);
  const subtotal = basePrice + addonsTotal;
  const gstTax = Math.round(subtotal * 0.05); // 5% GST
  const serviceFee = Math.round(subtotal * 0.02); // 2% Service Fee
  const grandTotal = subtotal + gstTax + serviceFee;

  // Validation before submit
  const handleBookingSubmit = () => {
    if (!venue) return;
    if (!startDateTime || !endDateTime) {
      alert("Please select dates first.");
      return;
    }
    onSubmit();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not selected";
    return new Date(dateStr).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24 text-card-foreground">
      {/* 1. Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground border-b border-border pb-3">
          Booking Summary
        </h3>

        {!venue ? (
          <p className="text-xs text-muted text-center py-6">
            Select a venue on the left to review your pricing breakdown.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Venue Preview */}
            <div className="flex gap-3">
              {venue.images && venue.images[0] ? (
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-16 h-16 object-cover rounded-xl border border-border"
                />
              ) : (
                <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-xl border border-border font-bold">
                  {venue.name.charAt(0)}
                </div>
              )}
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-primary block uppercase tracking-wide">
                  {venue.categoryId && typeof venue.categoryId === "object" ? venue.categoryId.name : "Venue"}
                </span>
                <span className="text-sm font-bold text-foreground block line-clamp-1">{venue.name}</span>
                <span className="text-xs text-muted block line-clamp-1">
                  {venue.address.city}, {venue.address.state}
                </span>
              </div>
            </div>

            {/* Dates & Duration Summary */}
            <div className="bg-background p-3.5 rounded-xl border border-border text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted font-medium">Check-In:</span>
                <span className="font-semibold text-foreground">{formatDate(startDateTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted font-medium">Check-Out:</span>
                <span className="font-semibold text-foreground">{formatDate(endDateTime)}</span>
              </div>
              <div className="border-t border-border/60 pt-2 flex justify-between items-center">
                <span className="text-muted font-medium">Total Duration:</span>
                <span className="font-bold text-primary">
                  {duration > 0 ? `${duration} ${durationUnit}${duration > 1 ? "s" : ""}` : "—"}
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-b border-border pb-3">
              <div className="flex justify-between">
                <span className="text-muted">
                  Base Price ({duration > 0 ? `${duration} × ` : ""}₹{priceRate.toLocaleString("en-IN")}/{pricingUnit})
                </span>
                <span className="font-semibold text-foreground">₹{basePrice.toLocaleString("en-IN")}</span>
              </div>

              {selectedAddons.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-muted block font-semibold text-[10px] uppercase tracking-wider">Add-ons:</span>
                  {selectedAddons.map((addon) => (
                    <div key={addon.id} className="flex justify-between pl-2 text-muted">
                      <span>• {addon.name}</span>
                      <span>₹{calculateAddonCost(addon).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pl-2 font-medium text-foreground pt-1 border-t border-dashed border-border/50">
                    <span>Add-ons Subtotal</span>
                    <span>₹{addonsTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span className="flex items-center gap-1">GST (5%)</span>
                <span>₹{gstTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span className="flex items-center gap-1">Service & Security Fee (2%)</span>
                <span>₹{serviceFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">Total Amount</span>
                <span className="text-2xl font-extrabold text-primary">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Confirm & Book Now CTA Button inside Bottom of Booking Summary Card */}
            {duration > 0 && (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all select-none hover:scale-[1.01] active:scale-[0.99] cursor-pointer uppercase tracking-wider"
              >
                Confirm & Proceed to Pay (₹{grandTotal.toLocaleString("en-IN")})
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Payment Modal Popup overlay */}
      {isPaymentModalOpen && venue && duration > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-border flex flex-col md:h-[580px] max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-5 bg-surface">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Secure Checkout
                </h3>
                <span className="text-[10px] text-muted block">Transaction ID: BMV-TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-0">
              
              {/* Left Panel: Payment Selector & Information Details (col-span-7) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <h4 className="text-base font-extrabold text-foreground">Select Payment Method</h4>
                    <p className="text-xs text-muted">
                      Please choose your preferred checkout method. You can switch options at any time.
                    </p>
                  </div>

                  {/* Option Cards Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => onPaymentMethodChange("card")}
                      className={`flex flex-col items-center justify-center py-6 px-4 border rounded-2xl cursor-pointer transition-all gap-2.5 ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 text-primary shadow-inner scale-[1.02] ring-2 ring-primary/20"
                          : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
                      }`}
                    >
                      <CreditCard size={24} />
                      <span className="text-xs font-extrabold">Razorpay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPaymentMethodChange("upi")}
                      className={`flex flex-col items-center justify-center py-6 px-4 border rounded-2xl cursor-pointer transition-all gap-2.5 ${
                        paymentMethod === "upi"
                          ? "border-primary bg-primary/5 text-primary shadow-inner scale-[1.02] ring-2 ring-primary/20"
                          : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
                      }`}
                    >
                      <Wallet size={24} />
                      <span className="text-xs font-extrabold">BMV Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPaymentMethodChange("cash")}
                      className={`flex flex-col items-center justify-center py-6 px-4 border rounded-2xl cursor-pointer transition-all gap-2.5 ${
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/5 text-primary shadow-inner scale-[1.02] ring-2 ring-primary/20"
                          : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
                      }`}
                    >
                      <Landmark size={24} />
                      <span className="text-xs font-extrabold">Pay at Venue</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Information Panels */}
                <div className="bg-surface/40 border border-border/80 rounded-2xl p-6 flex-1 flex flex-col justify-center min-h-[140px] transition-all text-card-foreground">
                  {paymentMethod === "card" && (
                    <div className="space-y-3 text-left">
                      <span className="text-xs font-extrabold text-foreground uppercase tracking-wider block">Razorpay Direct Gateway</span>
                      <p className="text-xs text-muted leading-relaxed">
                        Pay securely online via <strong>Razorpay</strong>. Upon clicking checkout, you will be redirected to a payment gateway window where you can complete your payment via Credit/Debit Cards, UPI apps, Netbanking, or mobile wallets.
                      </p>
                      <ul className="text-[11px] text-muted space-y-1.5 pt-1 pl-4 list-disc">
                        <li>Supports Google Pay, PhonePe, Paytm, and WhatsApp UPI</li>
                        <li>Visa, MasterCard, RuPay, and Amex accepted</li>
                        <li>Safe and encrypted connection protocol</li>
                      </ul>
                    </div>
                  )}
                  {paymentMethod === "upi" && (
                    <div className="space-y-3 text-left">
                      <span className="text-xs font-extrabold text-foreground uppercase tracking-wider block">BookMyVenue Wallet Payment</span>
                      <p className="text-xs text-muted leading-relaxed">
                        Debit the total booking amount instantly using your pre-funded <strong>BMV Wallet balance</strong>. Ideal for single-tap bookings and rapid checkouts.
                      </p>
                      <ul className="text-[11px] text-muted space-y-1.5 pt-1 pl-4 list-disc">
                        <li>Instant debit with zero gateway redirection delays</li>
                        <li>Secured by local wallet pin and verification authorization</li>
                        <li>Wallet balance statement update upon success</li>
                      </ul>
                    </div>
                  )}
                  {paymentMethod === "cash" && (
                    <div className="space-y-3 text-left">
                      <span className="text-xs font-extrabold text-foreground uppercase tracking-wider block">Pay at Venue (Arrival)</span>
                      <p className="text-xs text-muted leading-relaxed">
                        Reserve your slot today with <strong>zero immediate charge</strong>. Pay the full booking total directly to the venue coordinator when checking in.
                      </p>
                      <ul className="text-[11px] text-muted space-y-1.5 pt-1 pl-4 list-disc">
                        <li>Pay on the day of check-in via Cash, Card, or UPI scan at the counter</li>
                        <li>No credit card required to hold the booking</li>
                        <li>Subject to venue cancellation and buffer timeout policies</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Transaction Actions & Secure Seals (col-span-5) */}
              <div className="md:col-span-5 bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6 h-full">
                
                {/* Visual Lock Seal & Brand details */}
                <div className="flex flex-col items-center justify-center text-center space-y-5 flex-1 my-auto">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary">
                    <ShieldCheck size={48} className="animate-pulse" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 border-2 border-background">
                      <span className="block w-3 h-3 rounded-full bg-white animate-ping" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-wider">Secured Portal</h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">BookMyVenue Payments</span>
                  </div>
                </div>

                {/* Amount Due Display Block */}
                <div className="bg-background border border-border/80 rounded-xl py-4 px-6 text-center space-y-1">
                  <span className="text-[10px] text-muted uppercase tracking-wider font-extrabold block">Total Due Amount</span>
                  <span className="text-3xl font-black text-primary block font-sans">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>

                {/* Checkout CTA trigger */}
                <div className="space-y-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleBookingSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="w-4 h-4 animate-spin mr-2" />
                        PROCESSING ORDER…
                      </>
                    ) : paymentMethod === "cash" ? (
                      `CONFIRM RESERVATION`
                    ) : (
                      `PAY & CONFIRM RESERVATION`
                    )}
                  </button>

                  {/* Encryption trust seals */}
                  <div className="flex flex-col items-center justify-center gap-1.5 text-[9px] text-muted font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-green-600 shrink-0" />
                      256-Bit SSL Secured Checkout
                    </span>
                    <span>Razorpay & BMV Partner Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;