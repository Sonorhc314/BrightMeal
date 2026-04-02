import { formatCO2e, formatEfficiency } from '@/lib/gamification-config';

interface LeaderboardEntryProps {
  rank: number;
  name: string;
  points: number;
  totalKg: number;
  badgeCount: number;
  totalDonations: number;
  currentStreak: number;
  businessType?: string | null;
  isCurrentUser: boolean;
  accentColor: string;
}

const rankMedals: Record<number, string> = {
  1: '\u{1F947}',
  2: '\u{1F948}',
  3: '\u{1F949}',
};

export function LeaderboardEntry({
  rank,
  name,
  points,
  totalKg,
  badgeCount,
  totalDonations,
  currentStreak,
  businessType,
  isCurrentUser,
  accentColor,
}: LeaderboardEntryProps) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        isCurrentUser
          ? 'border-brand-green bg-brand-green/5 shadow-sm'
          : 'border-border bg-white hover:shadow-sm'
      }`}
    >
      {/* Rank */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {rankMedals[rank] ? (
          <span className="text-xl">{rankMedals[rank]}</span>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accentColor} text-sm font-bold text-white`}>
        {initial}
      </div>

      {/* Name + business type + streak */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isCurrentUser ? 'text-brand-green' : 'text-foreground'}`}>
          {name}
          {isCurrentUser && <span className="ml-1 text-xs font-normal text-muted-foreground">(You)</span>}
        </p>
        <div className="flex items-center gap-2">
          {businessType && (
            <p className="truncate text-xs text-muted-foreground">{businessType}</p>
          )}
          {currentStreak >= 2 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600">
              &#x1F525;{currentStreak}w
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex shrink-0 items-center gap-3 text-right">
        <div>
          <p className="text-sm font-bold text-foreground">{points.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">pts</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-muted-foreground">{formatEfficiency(points, totalDonations)}</p>
          <p className="text-[10px] text-muted-foreground">avg/don</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-muted-foreground">{formatCO2e(totalKg)}</p>
          <p className="text-[10px] text-muted-foreground">CO2e</p>
        </div>
      </div>
    </div>
  );
}
