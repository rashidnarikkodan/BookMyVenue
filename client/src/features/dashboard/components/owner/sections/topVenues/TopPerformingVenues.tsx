import type { TopPerformingVenuesProps } from '@/features/dashboard/types/ownerDashbord.types';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopPerformingVenues({ data }: TopPerformingVenuesProps) {
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-6 shadow-xl transition-all duration-300 flex flex-col h-full justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
                Performance
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>

            <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
              Top <span className="text-primary">Performing Venues</span>
            </h2>
          </div>

          <Trophy className="w-5 h-5 text-primary" />
        </div>

        {/* Venue List */}
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-foreground/70" />
            </div>
            <p className="text-sm font-semibold text-foreground/70">
              No performance data
            </p>
            <p className="text-xs text-foreground/70 mt-1 max-w-[220px] mx-auto">
              Top venues will list here once bookings and revenue are generated.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3 cursor-pointer" onClick={()=>navigate('/owner/revenue')}>
            {data.map((venue, index) => (
              <div
                key={venue.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    #{index + 1}
                  </div>

                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{venue.name}</h3>

                    <p className="text-xs text-foreground/70">{venue.bookings} bookings</p>
                  </div>
                </div>

                <div className="text-right ">
                  <p className="font-bold text-black dark:text-white">
                    ₹{venue.revenue.toLocaleString()}
                  </p>

                  <p className="text-xs text-success flex items-center justify-end gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {venue.occupancyRate}% occupied
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
