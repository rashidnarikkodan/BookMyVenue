import RevenueDistributionChart, { COLORS } from "./DistributionChart";

const categoryData = [
  { category: 'Wedding Hall', revenue: 450000 },
  { category: 'Conference Hall', revenue: 250000 },
  { category: 'Party Hall', revenue: 180000 },
  { category: 'Sports Venue', revenue: 120000 },
];

export default function CategoryPerformanceStats() {
  const total = categoryData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
            Distribution
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Category <span className="text-[#e21a47]">Performance</span>
        </h2>

        {/* Donut Chart Container */}
        <div className="relative h-[220px] flex items-center justify-center">
          {/* Centered Total Label */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none z-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Total Revenue
            </span>
            <span className="text-lg font-black text-black dark:text-white mt-0.5">
              ₹{(total / 1000).toFixed(0)}k
            </span>
          </div>
          
          <div className="w-full h-full relative z-10">
            <RevenueDistributionChart data={categoryData} />
          </div>
        </div>
      </div>

      {/* Modern 2x2 Grid Legend */}
      <div className="grid grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
        {categoryData.map((item, index) => {
          const pct = ((item.revenue / total) * 100).toFixed(0);
          const color = COLORS[index % COLORS.length];
          return (
            <div key={item.category} className="flex items-start gap-2.5">
              <span 
                className="w-2 rounded-full h-2 mt-1.5 shrink-0" 
                style={{ backgroundColor: color }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-850 dark:text-zinc-200 truncate">
                  {item.category}
                </p>
                <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
                  ₹{(item.revenue / 1000).toFixed(0)}k • {pct}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
