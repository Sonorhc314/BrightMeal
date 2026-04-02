'use client';

import { badges, tierColors, getBadgesForRole } from '@/lib/gamification-config';
import type { UserRole, UserBadge } from '@/lib/types';

interface BadgeGridProps {
  role: UserRole;
  earnedBadges: UserBadge[];
}

export function BadgeGrid({ role, earnedBadges }: BadgeGridProps) {
  const roleBadges = getBadgesForRole(role);
  const earnedIds = new Set(earnedBadges.map((b) => b.badge_id));

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
      {roleBadges.map((badge) => {
        const earned = earnedIds.has(badge.id);
        const tier = tierColors[badge.tier];

        return (
          <div
            key={badge.id}
            className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${
              earned
                ? `${tier.bg} ${tier.border} shadow-sm`
                : 'border-border bg-muted/30 opacity-40'
            }`}
            title={`${badge.name}: ${badge.description}`}
          >
            <span className={`text-2xl ${earned ? '' : 'grayscale'}`}>
              {badge.icon}
            </span>
            <span className={`text-center text-[10px] font-medium leading-tight ${
              earned ? tier.text : 'text-muted-foreground'
            }`}>
              {badge.name}
            </span>
            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs text-white shadow-lg group-hover:block">
              {badge.description}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
