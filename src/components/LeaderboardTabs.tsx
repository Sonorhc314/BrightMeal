'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeaderboardEntry } from '@/components/LeaderboardEntry';
import { Trophy } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  total_points: number;
  total_kg_impact: number;
  total_donations_completed: number;
  current_streak: number;
  business_type: string | null;
  badge_count: number;
}

interface LeaderboardTabsProps {
  donors: LeaderboardUser[];
  charities: LeaderboardUser[];
  drivers: LeaderboardUser[];
  currentUserId: string;
  currentUserRole: string;
}

const roleAccent: Record<string, string> = {
  donor: 'bg-brand-green',
  charity: 'bg-brand-purple',
  driver: 'bg-blue-600',
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/50 py-12">
      <Trophy className="mb-3 h-10 w-10 text-muted-foreground/40" />
      <p className="font-medium text-muted-foreground">No rankings yet</p>
      <p className="mt-1 text-sm text-muted-foreground/70">
        Complete donations to appear on the leaderboard
      </p>
    </div>
  );
}

export function LeaderboardTabs({
  donors,
  charities,
  drivers,
  currentUserId,
  currentUserRole,
}: LeaderboardTabsProps) {
  const defaultTab = currentUserRole === 'charity' ? 'charities' : currentUserRole === 'driver' ? 'drivers' : 'donors';

  const renderList = (users: LeaderboardUser[], role: string) => {
    if (!users.length) return <EmptyState />;
    return (
      <div className="space-y-2">
        {users.map((user, i) => (
          <LeaderboardEntry
            key={user.id}
            rank={i + 1}
            name={user.name}
            points={user.total_points}
            totalKg={user.total_kg_impact}
            badgeCount={user.badge_count}
            totalDonations={user.total_donations_completed}
            currentStreak={user.current_streak}
            businessType={user.business_type}
            isCurrentUser={user.id === currentUserId}
            accentColor={roleAccent[role]}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="mb-4 grid w-full grid-cols-3">
        <TabsTrigger value="donors">Donors</TabsTrigger>
        <TabsTrigger value="charities">Charities</TabsTrigger>
        <TabsTrigger value="drivers">Drivers</TabsTrigger>
      </TabsList>
      <TabsContent value="donors">{renderList(donors, 'donor')}</TabsContent>
      <TabsContent value="charities">{renderList(charities, 'charity')}</TabsContent>
      <TabsContent value="drivers">{renderList(drivers, 'driver')}</TabsContent>
    </Tabs>
  );
}
