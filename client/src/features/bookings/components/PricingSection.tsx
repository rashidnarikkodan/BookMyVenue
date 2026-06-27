import React, { useState, useEffect } from "react";
import { CreditCard, QrCode, Landmark, ShieldCheck, HelpCircle } from "lucide-react";
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
  const [cardError, setCardError] = useState<string | null>(null);

  const pricingUnit = venue?.isAvailabilityConfigured ? "hour" : (venue?.pricing?.unit === "hour" ? "hour" : "day");
  const priceRate = venue?.isAvailabilityConfigured 
    ? (venue.availability?.pricePerHour || 1000) 
    : (venue?.pricing?.amount || 5000);

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

  // Credit Card Form Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    onPaymentDetailsChange({ ...paymentDetails, cardNumber: formattedValue });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    onPaymentDetailsChange({ ...paymentDetails, cardExpiry: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    onPaymentDetailsChange({ ...paymentDetails, cardCvv: value });
  };

  const handleHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaymentDetailsChange({ ...paymentDetails, cardHolder: e.target.value });
  };

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPaymentDetailsChange({ ...paymentDetails, upiId: e.target.value });
  };

  // Validation before submit
  const handleBookingSubmit = () => {
    if (!venue) return;
    if (!startDateTime || !endDateTime) {
      alert("Please select dates first.");
      return;
    }
    
    if (paymentMethod === "card") {
      const { cardNumber, cardExpiry, cardCvv, cardHolder } = paymentDetails;
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        setCardError("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setCardError("Please enter expiry date (MM/YY).");
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setCardError("Please enter a 3-digit CVV.");
        return;
      }
      if (!cardHolder || cardHolder.trim().length < 3) {
        setCardError("Please enter the cardholder's name.");
        return;
      }
      setCardError(null);
    } else if (paymentMethod === "upi") {
      const { upiId } = paymentDetails;
      if (!upiId || !upiId.includes("@")) {
        setCardError("Please enter a valid UPI ID (e.g. user@ybl).");
        return;
      }
      setCardError(null);
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
    <div className="space-y-6 lg:sticky lg:top-24">
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
                  {typeof venue.categoryId === "object" ? venue.categoryId.name : "Venue"}
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
            </div>

            {/* Taxes & Total */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
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
          </div>
        )}
      </div>

      {/* 2. Payment Selector & Form */}
      {venue && duration > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Select Payment Method
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onPaymentMethodChange("card");
                setCardError(null);
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl cursor-pointer transition-all gap-1.5 ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/5 text-primary shadow-inner"
                  : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
              }`}
            >
              <CreditCard size={18} />
              <span className="text-[10px] font-bold">Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPaymentMethodChange("upi");
                setCardError(null);
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl cursor-pointer transition-all gap-1.5 ${
                paymentMethod === "upi"
                  ? "border-primary bg-primary/5 text-primary shadow-inner"
                  : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
              }`}
            >
              <QrCode size={18} />
              <span className="text-[10px] font-bold">UPI / GPay</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onPaymentMethodChange("cash");
                setCardError(null);
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 border rounded-xl cursor-pointer transition-all gap-1.5 ${
                paymentMethod === "cash"
                  ? "border-primary bg-primary/5 text-primary shadow-inner"
                  : "border-border text-muted hover:border-primary/50 hover:bg-primary/5/10"
              }`}
            >
              <Landmark size={18} />
              <span className="text-[10px] font-bold">Pay at Venue</span>
            </button>
          </div>

          {/* Form Fields Based on Selection */}
          <div className="bg-background border border-border/80 rounded-xl p-4 transition-all">
            {paymentMethod === "card" && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-muted block mb-1">
                  CREDIT / DEBIT CARD DETAILS
                </span>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-foreground uppercase">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={paymentDetails.cardHolder || ""}
                    onChange={handleHolderChange}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-foreground uppercase">Card Number</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-mono"
                    placeholder="0000 0000 0000 0000"
                    value={paymentDetails.cardNumber || ""}
                    onChange={handleCardNumberChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-foreground uppercase">Expiry Date</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-mono"
                      placeholder="MM/YY"
                      value={paymentDetails.cardExpiry || ""}
                      onChange={handleExpiryChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold text-foreground uppercase">CVV</label>
                    <input
                      type="password"
                      required
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all font-mono"
                      placeholder="•••"
                      value={paymentDetails.cardCvv || ""}
                      onChange={handleCvvChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-3.5 text-center">
                <span className="text-[11px] font-bold text-muted block text-left mb-1">
                  UPI ID OR SCAN QR
                </span>

                {/* Simulated QR Code */}
                <div className="inline-flex flex-col items-center justify-center p-3 bg-white border border-border rounded-2xl shadow-sm mx-auto">
                  <div className="w-36 h-36 bg-slate-100 flex items-center justify-center relative rounded-lg border border-slate-200 overflow-hidden">
                    {/* Stylized QR placeholder using SVG and CSS */}
                    <div className="absolute inset-0 flex flex-wrap p-3 opacity-80 gap-1.5 select-none pointer-events-none">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3.5 h-3.5 rounded-sm ${
                            (i % 3 === 0 || i % 7 === 0 || (i > 10 && i < 20) || (i > 35 && i < 44))
                              ? "bg-slate-800"
                              : "bg-slate-200"
                          } ${
                            (i === 0 || i === 6 || i === 42 || i === 48)
                              ? "ring-2 ring-slate-800 bg-white p-0.5"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    {/* Small overlay badge with primary color */}
                    <div className="z-10 bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                      UPI PAY
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium mt-2 block">
                    Scan using PhonePe, GPay, or Paytm
                  </span>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-semibold text-foreground uppercase">
                    Or Enter UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="username@okaxis"
                    value={paymentDetails.upiId || ""}
                    onChange={handleUpiIdChange}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="space-y-2 text-center py-2">
                <span className="text-[11px] font-bold text-muted block text-left mb-1">
                  PAYMENT ON DELIVERY
                </span>
                <p className="text-xs text-muted leading-relaxed text-left">
                  Reserve your venue with zero online payment today. You can pay the total amount directly at the venue using Cash, Card, or UPI on the day of your booking.
                </p>
                <div className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-2 rounded-lg border border-primary/20 text-left mt-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>No credit card required to hold booking.</span>
                </div>
              </div>
            )}

            {cardError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] p-2.5 rounded-lg mt-3 font-medium">
                ⚠️ {cardError}
              </div>
            )}
          </div>

          {/* Secure transaction notice */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted font-medium py-1">
            <ShieldCheck size={12} className="text-green-600" />
            <span>256-Bit SSL Encrypted & Secure Checkout</span>
          </div>

          {/* Action Submit Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBookingSubmit}
            className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                PROCESSING RESERVATION…
              </>
            ) : (
              `CONFIRM & BOOK NOW (₹${grandTotal.toLocaleString("en-IN")})`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PricingSection;