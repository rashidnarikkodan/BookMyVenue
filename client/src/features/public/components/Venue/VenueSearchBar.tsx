import { Search, X } from 'lucide-react';

interface VenueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VenueSearchBar({ value, onChange }: VenueSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-lg">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for venues, categories, or cities..."
        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-foreground hover:bg-muted/20 transition-all cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
