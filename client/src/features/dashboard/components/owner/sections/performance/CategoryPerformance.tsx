import RevenueDistributionChart from './DistributionChart';
import { COLORS } from './chartColors';
import type { RevenueDistributionProps } from '@/features/dashboard/types/ownerDashbord.types';
import { PieChart } from 'lucide-react';

export default function CategoryPerformanceStats({ data }: RevenueDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
            Distribution
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Category <span className="text-primary">Performance</span>
        </h2>

        {data.length === 0 ? (
          <div className="h-[220px] flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-3">
              <PieChart className="w-5 h-5 text-foreground/70" />
            </div>
            <p className="text-sm font-semibold text-foreground/70">
              No category data available
            </p>
            <p className="text-xs text-foreground/70 mt-1 max-w-[200px] mx-auto">
              Revenue distribution will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="relative h-[220px] flex items-center justify-center">
              <div className="absolute flex flex-col items-center justify-center pointer-events-none z-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                  Total Revenue
                </span>
                <span className="text-lg font-black text-black dark:text-white mt-0.5">
                  ₹{(total / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="w-full h-full relative z-10">
                <RevenueDistributionChart data={data} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-border">
              {data.map((item, index) => {
                const pct = ((item.revenue / total) * 100).toFixed(0);
                const color = COLORS[index % COLORS.length];

                return (
                  <div key={item.category} className="flex items-start gap-2.5">
                    <span
                      className="w-2 rounded-full h-2 mt-1.5 shrink-0"
                      style={{ backgroundColor: color }}
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {item.category}
                      </p>

                      <p className="text-[10px] font-medium text-foreground/70 mt-0.5">
                        ₹{(item.revenue / 1000).toFixed(0)}k • {pct}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
