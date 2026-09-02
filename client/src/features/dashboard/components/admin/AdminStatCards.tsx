import { Users, Building2, CalendarDays, IndianRupee, ArrowUpRight } from 'lucide-react';

function getColorScheme(index: number) {
  if (index === 0) {
    return {
      text: 'text-info',
      bg: 'bg-info/10',
      border: 'hover:border-info/40 dark:hover:border-info/50 hover:shadow-blue-500/5',
      glow: 'bg-info/5',
      trend: '0%',
      trendLabel: 'vs last month',
      trendType: 'positive',
      progress: 0,
      progressColor: 'bg-info',
    };
  }
  if (index === 1) {
    return {
      text: 'text-success',
      bg: 'bg-success/10',
      border:
        'hover:border-success/40 dark:hover:border-success/50 hover:shadow-emerald-500/5',
      glow: 'bg-success/5',
      trend: '0 pending',
      trendLabel: 'approval queue',
      trendType: 'warning',
      progress: 0,
      progressColor: 'bg-success',
    };
  }
  if (index === 2) {
    return {
      text: 'text-warning',
      bg: 'bg-warning/10',
      border: 'hover:border-warning/40 dark:hover:border-warning/50 hover:shadow-amber-500/5',
      glow: 'bg-warning/5',
      trend: '0%',
      trendLabel: 'vs last month',
      trendType: 'positive',
      progress: 0,
      progressColor: 'bg-warning',
    };
  }
  return {
    text: 'text-primary',
    bg: 'bg-primary/10 dark:bg-primary/20',
    border: 'hover:border-primary/40 dark:hover:border-primary/50 hover:shadow-primary/5',
    glow: 'bg-primary/5',
    trend: '0%',
    trendLabel: 'vs last month',
    trendType: 'positive',
    progress: 0,
    progressColor: 'bg-primary',
  };
}

interface AdminStatCardsProps {
  data?: {
    totalUsers: number;
    totalVenues: number;
    totalBookings: number;
    totalRevenue: number;
  };
}

export default function AdminStatCards({ data }: AdminStatCardsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data ? data.totalUsers.toLocaleString() : '0',
      icon: <Users className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Venues',
      value: data ? data.totalVenues.toLocaleString() : '0',
      icon: <Building2 className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Bookings',
      value: data ? data.totalBookings.toLocaleString() : '0',
      icon: <CalendarDays className="w-5.5 h-5.5" />,
    },
    {
      title: 'Total Revenue',
      value: data ? `₹${(data.totalRevenue / 100000).toFixed(1)}L` : '₹0.0L',
      icon: <IndianRupee className="w-5.5 h-5.5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const color = getColorScheme(index);
        return (
          <div
            key={stat.title}
            className={`rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-5 shadow-xl relative overflow-hidden group transition-all duration-300 ${color.border}`}
          >
            <div
              className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${color.glow}`}
            />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                {stat.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${color.bg} ${color.text}`}
              >
                {stat.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black tracking-tight text-black dark:text-white">
                {stat.value}
              </span>
            </div>

            <div className="space-y-2">
              <div className="w-full h-1 bg-card rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color.progressColor}`}
                  style={{ width: `${color.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium text-foreground/70">
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    color.trendType === 'positive'
                      ? 'text-success'
                      : color.trendType === 'warning'
                        ? 'text-warning'
                        : 'text-error'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {color.trend}
                </span>
                <span>{color.trendLabel}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
