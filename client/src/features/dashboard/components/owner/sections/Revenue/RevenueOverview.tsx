import { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import RevenueChart from './RevenueChart';
import type {
  FilterType,
  RevenueTitleProps,
  RevenueOverviewProps,
} from '../../../../types/ownerDashbord.types.ts';

type RevenuePoint = {
  period: string;
  revenue: number;
  bookings: number;
};

export default function RevenueOverView({ data }: RevenueOverviewProps) {
  const [filter, setFilter] = useState<FilterType>('yearly');

  const chartData = (data && !Array.isArray(data)) ? (data as any)[filter] : [];

  return (
    <div className="rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300">
      <RevenueTitle filter={filter} setFilter={setFilter} chartData={chartData} />

      <div className="mt-6">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}

// --------------------
// Title Component
// --------------------
function RevenueTitle({
  filter,
  setFilter,
  chartData,
}: RevenueTitleProps & {
  chartData: RevenuePoint[];
}) {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);

  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
              Performance Indicators
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
            Revenue <span className="text-primary">Overview</span>
          </h2>
        </div>

        {/* Filter Switcher Pill */}
        <div className="flex bg-card p-1 rounded-xl border border-border w-fit">
          {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === t
                  ? 'bg-white dark:bg-card text-primary dark:text-[#f56565] shadow-sm'
                  : 'text-foreground/70 hover:text-foreground/45'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Key Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Revenue */}
        <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
              Earnings
            </span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </span>
          </div>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-warning/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
              Bookings
            </span>
            <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
              {totalBookings}
            </h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +8.2%
            </span>
          </div>
        </div>

        {/* Card 3: Avg Booking Value */}
        <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden group hover:border-success/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
              Avg / Book
            </span>
            <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
              ₹{avgBookingValue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-foreground/70 font-bold flex items-center gap-0.5 mt-0.5">
              Stable
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
