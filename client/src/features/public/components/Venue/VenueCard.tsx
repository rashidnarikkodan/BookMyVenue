import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, IndianRupee } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const navigate = useNavigate();

  const categoryName =
    venue.categoryId && typeof venue.categoryId === 'object' ? venue.categoryId.name : 'Uncategorized';

  return (
    <div
      onClick={() => navigate(`/venues/${venue._id}`)}
      className="group rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-background">
        {venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <Building2 size={36} className="stroke-[1.2]" />
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
          {categoryName}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">
              {venue.address.city}, {venue.address.state}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <Users size={13} className="text-muted" />
            <span className="font-semibold">{venue.capacity} guests</span>
          </div>
          <div className="flex items-center gap-0.5 text-sm font-bold text-primary">
            <IndianRupee size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
