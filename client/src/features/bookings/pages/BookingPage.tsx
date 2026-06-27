import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store/app.store";
import { publicVenuesApi } from "@/features/public/services/public-venues.api";
import type { Venue } from "@/features/venues/types/venues.types";
import { bookingsApi } from "../services/bookings.api";
import type { Addon, BookingDetails } from "../types/bookings.types";
import DateTimeSection from "../components/DateTimeSection";
import GuestSection from "../components/GuestSection";
import AddonsSection from "../components/AddonsSection";
import PricingSection from "../components/PricingSection";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Printer,
  Sparkles,
  User,
  Users,
  ExternalLink,
} from "lucide-react";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const venueIdParam = searchParams.get("venueId");
  const { user } = useAppStore();

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venueSearch, setVenueSearch] = useState("");

  // Form fields state
  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  
  // Contact details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">("card");
  const [paymentDetails, setPaymentDetails] = useState<any>({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
    upiId: "",
  });

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Auto fill logged in user
  useEffect(() => {
    if (user) {
      setContactName(user.fullName || "");
      setContactEmail(user.email || "");
    }
  }, [user]);

  // Fetch specific venue from query param
  useEffect(() => {
    const fetchSelected = async () => {
      if (!venueIdParam) return;
      try {
        setVenuesLoading(true);
        const res = await publicVenuesApi.getById(venueIdParam);
        if (res.success && res.data) {
          setSelectedVenue(res.data);
          // Set capacity-appropriate guests default
          setGuests(1);
        }
      } catch (err) {
        console.error("Error fetching selected venue", err);
        toast.error("Could not fetch the specified venue details.");
      } finally {
        setVenuesLoading(false);
      }
    };
    fetchSelected();
  }, [venueIdParam]);

  // Fetch all venues for direct bookings
  useEffect(() => {
    const fetchAllVenues = async () => {
      try {
        setVenuesLoading(true);
        const res = await publicVenuesApi.getAll({ limit: 100 });
        if (res.success && res.data?.venues) {
          setVenues(res.data.venues);
        }
      } catch (err) {
        console.error("Error fetching venues list", err);
      } finally {
        setVenuesLoading(false);
      }
    };
    fetchAllVenues();
  }, []);

  const handleAddonsChange = (addons: Addon[]) => {
    setSelectedAddons(addons);
  };

  const handleContactDetailsChange = (data: any) => {
    if (data.guests !== undefined) setGuests(data.guests);
    if (data.contactName !== undefined) setContactName(data.contactName);
    if (data.contactEmail !== undefined) setContactEmail(data.contactEmail);
    if (data.contactPhone !== undefined) setContactPhone(data.contactPhone);
    if (data.specialRequests !== undefined) setSpecialRequests(data.specialRequests);
  };

  const handlePaymentDetailsChange = (details: any) => {
    setPaymentDetails(details);
  };

  const handleSubmitBooking = async () => {
    if (!selectedVenue) return;
    setIsSubmitting(true);

    const bookingPayload: BookingDetails = {
      venueId: selectedVenue._id,
      startDateTime,
      endDateTime,
      guests,
      addOns: selectedAddons,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      paymentMethod,
      paymentDetails: {
        cardNumber: paymentDetails.cardNumber,
        cardExpiry: paymentDetails.cardExpiry,
        cardCvv: paymentDetails.cardCvv,
        cardHolder: paymentDetails.cardHolder,
        upiId: paymentDetails.upiId,
      },
    };

    try {
      const res = await bookingsApi.createBooking(bookingPayload);
      if (res.success) {
        toast.success(res.message || "Booking successfully created!");
        setSuccessData(res.data);
      } else {
        toast.error(res.message || "Booking creation failed.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while creating booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredVenues = venues.filter(
    (v) =>
      v.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.address.city.toLowerCase().includes(venueSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              Secure Checkout
            </h1>
            <p className="text-sm text-muted mt-1">
              Complete your venue reservation details and proceed to confirmation
            </p>
          </div>
          <Link
            to="/venues"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Venues
          </Link>
        </div>

        {/* main grid content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Form controls */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* Venue Selector / Selected info */}
            {!selectedVenue ? (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">1. Select a Venue to Book</h3>
                  <p className="text-xs text-muted">Search through our verified list of venues to start booking</p>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search venue by name, city..."
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                  />
                </div>
                
                {venuesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredVenues.length === 0 ? (
                  <div className="text-center py-12 text-muted text-sm">
                    No venues found matching your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1">
                    {filteredVenues.map((v) => (
                      <div
                        key={v._id}
                        onClick={() => {
                          setSelectedVenue(v);
                        }}
                        className="flex border border-border hover:border-primary rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-sm"
                      >
                        {v.images && v.images[0] ? (
                          <img
                            src={v.images[0]}
                            alt={v.name}
                            className="w-20 object-cover"
                          />
                        ) : (
                          <div className="w-20 bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {v.name.charAt(0)}
                          </div>
                        )}
                        <div className="p-3 flex flex-col justify-between flex-grow">
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase block">
                              {typeof v.categoryId === "object" ? v.categoryId.name : "Venue"}
                            </span>
                            <span className="text-sm font-bold text-foreground block line-clamp-1">{v.name}</span>
                            <span className="text-xs text-muted block line-clamp-1">{v.address.city}</span>
                          </div>
                          <div className="flex justify-between items-baseline mt-2">
                            <span className="text-[10px] font-semibold text-foreground">
                              Cap: {v.capacity}
                            </span>
                            <span className="text-xs font-bold text-primary">
                              ₹{v.isAvailabilityConfigured 
                                ? `${v.availability?.pricePerHour.toLocaleString()}/hr`
                                : `${v.pricing?.amount.toLocaleString()}/day`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md">
                <div className="flex gap-4 items-center">
                  {selectedVenue.images && selectedVenue.images[0] ? (
                    <img
                      src={selectedVenue.images[0]}
                      alt={selectedVenue.name}
                      className="w-20 h-20 object-cover rounded-xl border border-border"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-xl border border-border font-bold text-xl">
                      {selectedVenue.name.charAt(0)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                      {typeof selectedVenue.categoryId === "object" 
                        ? selectedVenue.categoryId.name 
                        : "Selected Venue"}
                    </span>
                    <h3 className="text-lg font-extrabold text-foreground">{selectedVenue.name}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {selectedVenue.address.city}, {selectedVenue.address.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> Capacity: {selectedVenue.capacity} guests
                      </span>
                    </div>
                  </div>
                </div>
                {!venueIdParam && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVenue(null);
                      setStartDateTime(null);
                      setEndDateTime(null);
                      setSelectedAddons([]);
                    }}
                    className="text-xs font-bold text-primary hover:text-primary/80 border border-primary/20 hover:border-primary px-3.5 py-2 rounded-xl transition-all"
                  >
                    Change Venue
                  </button>
                )}
              </div>
            )}

            {selectedVenue && (
              <>
                {/* 2. Date Time picker */}
                <DateTimeSection
                  startDateTime={startDateTime}
                  endDateTime={endDateTime}
                  pricingUnit={selectedVenue.isAvailabilityConfigured ? "hour" : "day"}
                  availability={selectedVenue.availability}
                  onChange={(start, end) => {
                    setStartDateTime(start);
                    setEndDateTime(end);
                  }}
                />

                {/* 3. Guests and Contact fields */}
                <GuestSection
                  guests={guests}
                  maxCapacity={selectedVenue.capacity}
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                  specialRequests={specialRequests}
                  onChange={handleContactDetailsChange}
                />

                {/* 4. Addons checklist */}
                <AddonsSection
                  guests={guests}
                  selectedAddons={selectedAddons}
                  onChange={handleAddonsChange}
                />
              </>
            )}
          </div>

          {/* RIGHT COLUMN: Summary and Payments */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PricingSection
              venue={selectedVenue}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              guests={guests}
              selectedAddons={selectedAddons}
              paymentMethod={paymentMethod}
              paymentDetails={paymentDetails}
              onPaymentMethodChange={setPaymentMethod}
              onPaymentDetailsChange={handlePaymentDetailsChange}
              onSubmit={handleSubmitBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL OVERLAY */}
      {successData && (
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
                <span className="font-bold text-foreground block text-sm">{selectedVenue?.name}</span>
                <span className="text-muted block">
                  {selectedVenue?.address.street}, {selectedVenue?.address.city}
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
                  ₹{selectedAddons.reduce((sum, a) => {
                    const addonCost = a.priceType === "perHead" 
                      ? a.price * guests 
                      : a.price;
                    return sum + addonCost;
                  }, 0) + (selectedVenue?.isAvailabilityConfigured 
                    ? (selectedVenue.availability?.pricePerHour || 1000) 
                    : (selectedVenue?.pricing?.amount || 5000)) * (startDateTime && endDateTime ? (selectedVenue?.isAvailabilityConfigured ? Math.ceil((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 3600000) : Math.ceil((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 86400000)) : 0) + Math.round((selectedAddons.reduce((sum, a) => {
                      const addonCost = a.priceType === "perHead" 
                        ? a.price * guests 
                        : a.price;
                      return sum + addonCost;
                    }, 0) + (selectedVenue?.isAvailabilityConfigured 
                      ? (selectedVenue.availability?.pricePerHour || 1000) 
                      : (selectedVenue?.pricing?.amount || 5000)) * (startDateTime && endDateTime ? (selectedVenue?.isAvailabilityConfigured ? Math.ceil((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 3600000) : Math.ceil((new Date(endDateTime).getTime() - new Date(startDateTime).getTime()) / 86400000)) : 0)) * 0.07)}
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
                  setSuccessData(null);
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
                onClick={() => setSuccessData(null)}
              >
                View My Bookings Dashboard <ExternalLink size={10} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple helper to format dates in India standard time inside modal
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default BookingPage;