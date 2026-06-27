import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BookingHeaderProps {
  venueId?: string;
}

export default function BookingHeader({ venueId }: BookingHeaderProps) {
  return (
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
        to={venueId ? `/venues/${venueId}` : "/venues"}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Venue Details
      </Link>
    </div>
  );
}
