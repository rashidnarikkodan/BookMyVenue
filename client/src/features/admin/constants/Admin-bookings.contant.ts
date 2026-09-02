
export const STATUS_STYLES: Record<string, string> = {
  RESERVED: 'border-info/20 bg-info/10 text-info',
  CONFIRMED: 'border-success/20 bg-success/10 text-success',
  COMPLETED: 'border-purple-500/20 bg-purple-500/10 text-purple-500',
  CANCELLED: 'border-error/20 bg-error/10 text-error',
};

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const SORT_OPTIONS = [
  { value: 'new-old', label: 'Newest First' },
  { value: 'old-new', label: 'Oldest First' },
  { value: 'a-z', label: 'Venue: A–Z' },
  { value: 'z-a', label: 'Venue: Z–A' },
  { value: 'price-high-low', label: 'Price: High → Low' },
  { value: 'price-low-high', label: 'Price: Low → High' },
  { value: 'guests-high-low', label: 'Guests: High → Low' },
  { value: 'guests-low-high', label: 'Guests: Low → High' },
];