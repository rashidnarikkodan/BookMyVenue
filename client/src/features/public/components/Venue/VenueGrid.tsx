import type { Venue } from '@/features/venues/types/venues.types';
import VenueCard from './VenueCard';

interface VenueGridProps {
  venues: Venue[];
  userCoords?: { lat: number; lng: number } | null;
}

export default function VenueGrid({ venues, userCoords }: VenueGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {venues.map((venue) => (
        <VenueCard key={venue._id} venue={venue} userCoords={userCoords} />
      ))}
    </div>
  );
}
