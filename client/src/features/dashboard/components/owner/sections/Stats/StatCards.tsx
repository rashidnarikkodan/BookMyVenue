import type React from 'react';
import type { StatCardProps } from '@/features/dashboard/types/ownerDashbord.types';
import { IndianRupee, CalendarDays, Building2, Star, TrendingUp } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  index: number;
}

function getIconForTitle(title: string, customIcon?: React.ReactNode) {
  if (customIcon) return customIcon;

  const t = title.toLowerCase();
  if (t.includes('revenue') || t.includes('earning') || t.includes('sales')) {
    return <IndianRupee className="w-5 h-5" />;
  }
  if (t.includes('booking') || t.includes('schedule')) {
    return <CalendarDays className="w-5 h-5" />;
  }
  if (t.includes('venue') || t.includes('property') || t.includes('hall')) {
    return <Building2 className="w-5 h-5" />;
  }
  if (t.includes('rating') || t.includes('review') || t.includes('star')) {
    return <Star className="w-5 h-5" />;
  }
  return <TrendingUp className="w-5 h-5" />;
}

function getColorScheme(title: string, index: number) {
  const t = title.toLowerCase();
  if (t.includes('revenue') || t.includes('earning') || index === 0) {
    return {
      text: 'text-primary',
      bg: 'bg-primary/10 dark:bg-primary/20',
      border: 'hover:border-primary/30 dark:hover:border-primary/40',
      glow: 'bg-primary/5',
      trendColor: 'text-success',
      trend: '+12.5% vs last month',
    };
  }
  if (t.includes('booking') || index === 1) {
    return {
      text: 'text-warning',
      bg: 'bg-warning/10',
      border: 'hover:border-warning/30 dark:hover:border-warning/40',
      glow: 'bg-warning/5',
      trendColor: 'text-success',
      trend: '+8.2% vs last month',
    };
  }
  if (t.includes('venue') || index === 2) {
    return {
      text: 'text-success',
      bg: 'bg-success/10',
      border: 'hover:border-success/30 dark:hover:border-success/40',
      glow: 'bg-success/5',
      trendColor: 'text-success',
      trend: 'All systems active',
    };
  }
  return {
    text: 'text-info',
    bg: 'bg-info/10',
    border: 'hover:border-info/30 dark:hover:border-info/40',
    glow: 'bg-info/5',
    trendColor: 'text-foreground/70',
    trend: 'Based on 84 reviews',
  };
}

export default function StatCards({ data }: StatCardProps) {
  console.log('stats data', data);
  const displayData = data
    ? data
    : [
        { title: 'Total Revenue', value: '--' },
        { title: 'Total Bookings', value: '--' },
        { title: 'Active Venues', value: '--' },
        { title: 'Avg Rating', value: '--' },
      ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {displayData.map((stat, index) => (
        <Card
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={getIconForTitle(stat.title)}
          index={index}
        />
      ))}
    </div>
  );
}

function Card({ title, value, icon, index }: CardProps) {
  const colors = getColorScheme(title, index);
  const resolvedIcon = getIconForTitle(title, icon);

  const hasData = value !== '--';

  return (
    <div
      className={`rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group ${colors.border}`}
    >
      <div
        className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${colors.glow}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          {title}
        </span>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${colors.bg} ${colors.text}`}
        >
          {resolvedIcon}
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight">{value}</h2>

        <p className="text-[10px] font-bold mt-1.5 text-foreground/70">
          {hasData ? colors.trend : 'No data available'}
        </p>
      </div>
    </div>
  );
}
