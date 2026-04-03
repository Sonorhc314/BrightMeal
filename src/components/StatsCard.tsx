interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  accent?: 'green' | 'purple' | 'blue';
}

const accentStyles = {
  green: 'bg-brand-green/10 text-brand-green',
  purple: 'bg-brand-purple/10 text-brand-purple',
  blue: 'bg-brand-blue-light text-brand-blue',
};

export function StatsCard({ label, value, icon, trend, accent = 'green' }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-3 lg:p-4 shadow-sm transition-all hover:shadow-md lg:border-border/50">
      <div className="mb-2 flex items-center justify-between">
        <div className={`flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg ${accentStyles[accent]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${accentStyles[accent].split(' ').pop()}`}>{trend}</span>
        )}
      </div>
      <p className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-xs lg:text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
