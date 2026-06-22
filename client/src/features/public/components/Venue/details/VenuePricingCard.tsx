import { Users, Building2, Calendar } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

interface VenuePricingCardProps {
  pricing: Venue['pricing'];
  capacity: number;
  categoryName: string;
  formattedDate: string;
}

export default function VenuePricingCard({
  pricing,
  capacity,
  categoryName,
  formattedDate,
}: VenuePricingCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-extrabold text-foreground">
          ₹{pricing.amount.toLocaleString()}
        </span>
        <span className="text-sm text-muted font-medium">/ {pricing.unit}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Users size={14} /> Capacity
          </div>
          <span className="text-sm font-bold text-foreground">{capacity} guests</span>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Building2 size={14} /> Category
          </div>
          <span className="text-sm font-bold text-foreground">{categoryName}</span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Calendar size={14} /> Listed
          </div>
          <span className="text-sm font-bold text-foreground">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
