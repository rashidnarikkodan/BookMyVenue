export default function HealthCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
}) {
  const styles = {
    blue: {
      border: 'hover:border-info/30',
      bg: 'bg-info/10',
      text: 'text-info',
      glow: 'bg-info/5',
    },

    green: {
      border: 'hover:border-success/30',
      bg: 'bg-success/10',
      text: 'text-success',
      glow: 'bg-success/5',
    },

    amber: {
      border: 'hover:border-warning/30',
      bg: 'bg-warning/10',
      text: 'text-warning',
      glow: 'bg-warning/5',
    },

    red: {
      border: 'hover:border-primary/30',
      bg: 'bg-primary/10',
      text: 'text-primary',
      glow: 'bg-primary/5',
    },
  };

  const s = styles[color];

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-4 relative overflow-hidden group transition-all duration-300 ${s.border}`}
    >
      <div
        className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300 ${s.glow}`}
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          {title}
        </span>

        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg} ${s.text}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="text-lg font-black text-black dark:text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
}
