import { SlidersHorizontal, X, ChevronDown, Users, IndianRupee, Layers, Compass } from 'lucide-react';
import type { Category } from '@/features/categories/types';
import type { PublicVenueQuery } from '../../services/public-venues.api';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'capacity_asc', label: 'Capacity: Low to High' },
  { value: 'capacity_desc', label: 'Capacity: High to Low' },
];

interface VenueFiltersProps {
  categories: Category[];
  showFilters: boolean;
  onToggleFilters: () => void;

  sortBy: PublicVenueQuery['sort'];
  onSortChange: (sort: PublicVenueQuery['sort']) => void;

  categoryFilter: string;
  onCategoryChange: (categoryId: string) => void;

  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;

  capacity: string;
  onCapacityChange: (value: string) => void;

  // GPS / Distance Range Props
  userCoords: { lat: number; lng: number } | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
  onEnableGps: () => void;
  onDisableGps: () => void;
  isLocating?: boolean;

  activeFilterCount: number;
  onClearAll: () => void;

  errors?: {
    minPrice?: string;
    maxPrice?: string;
    capacity?: string;
  };
}

export default function VenueFilters({
  categories,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  capacity,
  onCapacityChange,
  userCoords,
  radius,
  onRadiusChange,
  onEnableGps,
  activeFilterCount,
  onClearAll,
  errors = {},
}: VenueFiltersProps) {
  return (
    <>
      {/* Filter Toggle + Sort Row */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFilters}
          className={`
            inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs
            ${
              showFilters || activeFilterCount > 0
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground hover:bg-surface'
            }
          `}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as PublicVenueQuery['sort'])}
          className="appearance-none rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all shadow-2xs"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="w-full rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-md space-y-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-primary" /> Filter Venues
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-error hover:text-error/80 px-2 py-1 rounded-lg hover:bg-error/10 transition-colors cursor-pointer"
              >
                <X size={13} /> Reset All Filters
              </button>
            )}
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Layers size={14} className="text-primary" /> Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                Filter by event type or venue category
              </p>
            </div>

            {/* Single Minimum Capacity Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Users size={14} className="text-primary" /> Min Guests / Capacity
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => onCapacityChange(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full rounded-xl border border-border bg-background pl-3.5 pr-16 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-semibold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                  guests+
                </span>
              </div>
              {errors.capacity && (
                <p className="text-xs text-error font-medium">{errors.capacity}</p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Lists all venues with this capacity or higher
              </p>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <IndianRupee size={14} className="text-primary" /> Price / Hour (₹)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    placeholder="Min"
                    min="0"
                    className="w-full rounded-xl border border-border bg-background pl-6 pr-2.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <span className="text-xs text-muted-foreground font-semibold">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    placeholder="Max"
                    min="0"
                    className="w-full rounded-xl border border-border bg-background pl-6 pr-2.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
              {errors.minPrice && <p className="text-xs text-error font-medium">{errors.minPrice}</p>}
              {errors.maxPrice && <p className="text-xs text-error font-medium">{errors.maxPrice}</p>}
            </div>

            {/* GPS Range / Radius Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass size={14} className="text-primary" /> Range (Radius)
                </label>
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                  {radius} km
                </span>
              </div>

              <div className="pt-2">
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={radius}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    onRadiusChange(r);
                    if (!userCoords) onEnableGps();
                  }}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                <span>5 km</span>
                <span className={userCoords ? 'text-primary font-semibold' : ''}>
                  {userCoords ? 'GPS Active' : 'Slide to search nearby'}
                </span>
                <span>100 km</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
