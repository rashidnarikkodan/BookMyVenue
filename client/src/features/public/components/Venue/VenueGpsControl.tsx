import { LocateFixed, Loader2, X } from 'lucide-react';

interface VenueGpsControlProps {
  userCoords: { lat: number; lng: number } | null;
  radius: number;
  onEnableGps: () => void;
  onDisableGps: () => void;
  isLocating: boolean;
}

export default function VenueGpsControl({
  userCoords,
  radius,
  onEnableGps,
  onDisableGps,
  isLocating,
}: VenueGpsControlProps) {
  const isGpsActive = Boolean(userCoords);

  if (isGpsActive) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary text-xs font-bold transition-all shadow-2xs">
        <LocateFixed size={15} className="animate-pulse text-primary" />
        <span>Near Me (&le;{radius}km)</span>
        <button
          type="button"
          onClick={onDisableGps}
          className="ml-1 p-0.5 rounded-full hover:bg-primary/20 text-primary hover:text-error transition-colors cursor-pointer"
          title="Disable GPS location filter"
          aria-label="Disable GPS location filter"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onEnableGps}
      disabled={isLocating}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background hover:bg-surface text-xs font-semibold text-foreground hover:text-primary transition-all duration-200 cursor-pointer shadow-2xs hover:border-primary/40 disabled:opacity-60 disabled:cursor-not-allowed"
      title="Find venues near your location (default 25 km)"
    >
      {isLocating ? (
        <Loader2 size={15} className="animate-spin text-primary" />
      ) : (
        <LocateFixed size={15} className="text-primary" />
      )}
      <span>{isLocating ? 'Locating...' : 'Near Me'}</span>
    </button>
  );
}
