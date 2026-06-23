import { MapPin } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

interface VenueLocationProps {
  address: Venue['address'];
}

export default function VenueLocation({ address }: VenueLocationProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Location</h2>
      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground leading-relaxed">
          {address.street}, {address.city}
          <br />
          {address.district}, {address.state} - {address.pincode}
        </p>
      </div>
    </div>
  );
}
