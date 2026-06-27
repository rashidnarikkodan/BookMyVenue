import React, { useEffect, useState } from "react";
import { Calendar, Clock, Info } from "lucide-react";
import type { AvailabilityConfig } from "@/features/venues/types/venues.types";

type Props = {
  startDateTime: string | null;
  endDateTime: string | null;
  pricingUnit: "hour" | "day";
  availability?: AvailabilityConfig;
  onChange: (start: string | null, end: string | null) => void;
};

const DateTimeSection: React.FC<Props> = ({
  startDateTime,
  endDateTime,
  pricingUnit,
  availability,
  onChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [durationText, setDurationText] = useState<string>("");

  useEffect(() => {
    if (!startDateTime || !endDateTime) {
      setDurationText("");
      setError(null);
      return;
    }

    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();

    if (isNaN(start) || isNaN(end)) {
      setError("Invalid dates selected.");
      setDurationText("");
      return;
    }

    if (end <= start) {
      setError("End date & time must be after start date & time.");
      setDurationText("");
      return;
    }

    const now = new Date().getTime();
    if (start < now) {
      setError("Start time cannot be in the past.");
      setDurationText("");
      return;
    }

    setError(null);
    const diffMs = end - start;

    if (pricingUnit === "hour") {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      
      // Check constraints
      if (availability) {
        const { minBookingDuration, maxBookingDuration } = availability;
        if (hours < minBookingDuration) {
          setError(`Minimum booking duration is ${minBookingDuration} hours.`);
        } else if (maxBookingDuration && hours > maxBookingDuration) {
          setError(`Maximum booking duration is ${maxBookingDuration} hours.`);
        }
      }
      
      setDurationText(`${hours} hour${hours > 1 ? "s" : ""}`);
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      setDurationText(`${days} day${days > 1 ? "s" : ""}`);
    }
  }, [startDateTime, endDateTime, pricingUnit, availability]);

  const formatDayOfWeek = (dayNum: number): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayNum];
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="bg-primary/10 text-primary p-2 rounded-xl">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Select Date & Time</h3>
          <p className="text-xs text-muted">Choose your event timeline</p>
        </div>
      </div>

      {availability && (
        <div className="bg-primary/5 border border-primary/20 text-foreground text-xs p-3.5 rounded-xl flex items-start gap-2.5">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-primary block">Venue Operating Rules:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted">
              <span className="flex items-center gap-1">
                <Clock size={12} /> Hours: {availability.openingTime} - {availability.closingTime}
              </span>
              <span>
                Days: {availability.availableDays.map(formatDayOfWeek).join(", ")}
              </span>
              <span>
                Min Duration: {availability.minBookingDuration} hr{availability.minBookingDuration > 1 ? "s" : ""}
              </span>
              {availability.maxBookingDuration && (
                <span>Max Duration: {availability.maxBookingDuration} hrs</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Start Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              value={startDateTime || ""}
              onChange={(e) => onChange(e.target.value || null, endDateTime)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch (err) {
                  console.warn("showPicker is not supported in this browser", err);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            End Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              value={endDateTime || ""}
              onChange={(e) => onChange(startDateTime, e.target.value || null)}
              onClick={(e) => {
                try {
                  e.currentTarget.showPicker();
                } catch (err) {
                  console.warn("showPicker is not supported in this browser", err);
                }
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl flex items-center gap-2">
          <span>⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {durationText && !error && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 text-xs p-3 rounded-xl flex justify-between items-center">
          <span className="font-medium">Selected Duration:</span>
          <span className="font-bold text-sm bg-green-500 text-white px-2.5 py-0.5 rounded-full">
            {durationText}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateTimeSection;