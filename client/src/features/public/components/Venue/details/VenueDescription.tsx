interface VenueDescriptionProps {
  description: string;
}

export default function VenueDescription({ description }: VenueDescriptionProps) {
  return (
    <div className="py-6 border-b border-border/50 space-y-3 min-w-0 overflow-hidden">
      <h2 className="text-xl font-extrabold text-foreground tracking-tight">
        About this Venue
      </h2>
      <p className="text-base sm:text-lg text-foreground/85 leading-relaxed whitespace-pre-line font-normal break-words [overflow-wrap:anywhere]">
        {description}
      </p>
    </div>
  );
}
