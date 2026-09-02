import { Trophy, TrendingUp, Calendar, Star, Users, ArrowUpRight } from 'lucide-react';

interface PlatformLeaderItem {
  rank: number;
  title: string;
  name: string;
  metric: string;
}

interface PlatformLeadersProps {
  data?: PlatformLeaderItem[];
}

export default function PlatformLeaders({ data = [] }: PlatformLeadersProps) {
  const getVisuals = (rank: number) => {
    if (rank === 1) {
      return {
        icon: TrendingUp,
        colorClass:
          'from-warning/20 to-warning/10 border-warning/30 text-warning',
        rankBg: 'bg-warning text-black',
        glowClass: 'bg-warning/5',
      };
    }
    if (rank === 2) {
      return {
        icon: Calendar,
        colorClass:
          'from-info/20 to-info/10 border-info/30 text-info',
        rankBg: 'bg-gradient-to-r from-zinc-400 to-zinc-300 text-black',
        glowClass: 'bg-info/5',
      };
    }
    if (rank === 3) {
      return {
        icon: Star,
        colorClass:
          'from-success/20 to-success/10 border-success/30 text-success',
        rankBg: 'bg-warning text-white',
        glowClass: 'bg-success/5',
      };
    }
    return {
      icon: Users,
      colorClass:
        'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-500 dark:text-indigo-400',
      rankBg: 'bg-card text-foreground',
      glowClass: 'bg-indigo-500/5',
    };
  };

  const displayLeaders = data.map((item) => ({
    ...item,
    ...getVisuals(item.rank),
  }));

  return (
    <div className="rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
                Hall of Fame
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <h2 className="text-lg font-bold tracking-tight mt-1 text-black dark:text-white leading-none">
              Platform <span className="text-primary">Leaders</span>
            </h2>
          </div>
          <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Trophy className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayLeaders.length > 0 ? (
            displayLeaders.map((leader) => {
              const Icon = leader.icon;
              return (
                <div
                  key={leader.title}
                  className={`rounded-2xl border border-border bg-gradient-to-b ${leader.colorClass} p-5 shadow-md relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}
                >
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${leader.glowClass}`}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shadow-inner ${leader.rankBg}`}
                    >
                      {leader.rank}
                    </span>
                    <div className="w-8.5 h-8.5 rounded-xl bg-white/70 dark:bg-black/30 flex items-center justify-center shadow-sm">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70 block mb-1">
                    {leader.title}
                  </span>

                  <h3 className="text-base font-black text-black dark:text-white tracking-tight mb-2 truncate">
                    {leader.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-foreground dark:text-white">
                      {leader.metric}
                    </span>
                    <span className="text-[9px] font-bold text-success flex items-center gap-0.5 bg-success/10 px-1.5 py-0.5 rounded-md">
                      <ArrowUpRight className="w-3 h-3" />
                      Top
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-foreground/70 border border-dashed border-border rounded-2xl">
              <Trophy className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Data not available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
