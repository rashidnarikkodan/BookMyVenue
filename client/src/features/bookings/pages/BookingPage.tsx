import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store/app.store";
import { publicVenuesApi } from "@/features/public/services/public-venues.api";
import type { Venue } from "@/features/venues/types/venues.types";
import { bookingsApi } from "../services/bookings.api";
import type { BookingDetails } from "../types/bookings.types";
import DateTimeSection from "../components/DateTimeSection";
import GuestSection from "../components/GuestSection";
import PricingSection from "../components/PricingSection";
import BookingHeader from "../components/BookingHeader";
import SelectedVenueSummary from "../components/SelectedVenueSummary";
import BookingSuccessModal from "../components/BookingSuccessModal";
import { Loading } from "@/shared/components/ui";
import { useAsyncFetch } from "@/shared/hooks/useAsyncFetch";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppStore();

  // Venue state
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueLoading, setVenueLoading] = useState(false);

  //existing booking state
  const {data:existingBookings,execute} = useAsyncFetch()

  // Form fields state
  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);
  const [guests, setGuests] = useState<number>(1);
  // Contact details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "wallet" | "cash">("razorpay");

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

  // Fetch specific venue from route param
  useEffect(() => {
    const fetchSelected = async () => {
      if (!id) return;
      try {
        await execute(()=> bookingsApi.getByVenueId(id))
        console.log("existingBookings",existingBookings)
        setVenueLoading(true);
        const res = await publicVenuesApi.getById(id);
        if (res.success && res.data) {
          setSelectedVenue(res.data);
          setGuests(1);
        }
      } catch (err) {
        console.error("Error fetching selected venue", err);
        toast.error("Could not fetch the specified venue details.");
      } finally {
        setVenueLoading(false);
      }
    };
    fetchSelected();
  }, [id]);

  const handleContactDetailsChange = (data: any) => {
    if (data.guests !== undefined) setGuests(data.guests);
    if (data.contactName !== undefined) setContactName(data.contactName);
    if (data.contactEmail !== undefined) setContactEmail(data.contactEmail);
    if (data.contactPhone !== undefined) setContactPhone(data.contactPhone);
    if (data.specialRequests !== undefined) setSpecialRequests(data.specialRequests);
  };

  const handleSubmitBooking = async () => {
    if (!selectedVenue) return;
    setIsSubmitting(true);

    const bookingPayload: BookingDetails = {
      venueId: selectedVenue._id,
      startDateTime,
      endDateTime,
      guests,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      paymentMethod,
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

  if (venueLoading && !selectedVenue) {
    return (
      <Loading text="Retrieving checkout session…" fullPage={true} />
    );
  }

  if (!selectedVenue) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-4 text-card-foreground">
        <h2 className="text-xl font-bold text-foreground">Booking Session Expired</h2>
        <p className="text-sm text-muted max-w-sm">
          No valid venue details were loaded. Please return to the venue search page and select a venue.
        </p>
        <Link
          to="/venues"
          className="bg-primary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/95 transition-all"
        >
          Explore Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 text-card-foreground">
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <BookingHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* LEFT COLUMN: Venue Details and Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-8">
            {/* Venue Brief Summary Header */}
            <SelectedVenueSummary venue={selectedVenue} />

            {/* 2. Date and Time Configuration slots picker */}
            <DateTimeSection
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              pricingUnit="hour"
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
          </div>

          {/* RIGHT COLUMN: Summary and Payments */}
          <div className="lg:col-span-5 xl:col-span-4">
            <PricingSection
              venue={selectedVenue}
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onSubmit={handleSubmitBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP DRAWER MODAL */}
      {successData && (
        <BookingSuccessModal
          successData={successData}
          venue={selectedVenue}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          onClose={() => setSuccessData(null)}
        />
      )}
    </div>
  );
};

export default BookingPage;