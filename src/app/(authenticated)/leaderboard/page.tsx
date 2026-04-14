import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Trophy, Flame, Leaf, Cloud } from 'lucide-react';
import { LeaderboardTabs } from '@/components/LeaderboardTabs';
import { formatCO2e, formatMeals, formatKg } from '@/lib/gamification-config';
import type { UserRole } from '@/lib/types';

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Single parallel batch: profile + all 3 leaderboards + badge counts
  const [
    { data: profile },
    { data: donors },
    { data: charities },
    { data: drivers },
    { data: allBadges },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('profiles')
      .select('id, name, total_points, total_kg_impact, total_donations_completed, current_streak, business_type')
      .eq('role', 'donor')
      .gt('total_points', 0)
      .order('total_points', { ascending: false })
      .limit(20),
    supabase
      .from('profiles')
      .select('id, name, total_points, total_kg_impact, total_donations_completed, current_streak, business_type')
      .eq('role', 'charity')
      .gt('total_points', 0)
      .order('total_points', { ascending: false })
      .limit(20),
    supabase
      .from('profiles')
      .select('id, name, total_points, total_kg_impact, total_donations_completed, current_streak, business_type')
      .eq('role', 'driver')
      .gt('total_points', 0)
      .order('total_points', { ascending: false })
      .limit(20),
    supabase.from('user_badges').select('user_id'),
  ]);

  if (!profile) redirect('/login');

  const role = profile.role as UserRole;

  // Count badges per user (from the single query)
  const badgeCountMap: Record<string, number> = {};
  (allBadges || []).forEach((b) => {
    badgeCountMap[b.user_id] = (badgeCountMap[b.user_id] || 0) + 1;
  });

  const addBadgeCount = (users: typeof donors) =>
    (users || []).map((u) => ({ ...u, badge_count: badgeCountMap[u.id] || 0 }));

  // Compute rank from the leaderboard data we already have (no extra query)
  const roleList = role === 'donor' ? donors : role === 'charity' ? charities : drivers;
  const rankIndex = (roleList || []).findIndex((u) => u.id === user.id);
  const currentRank = rankIndex >= 0 ? rankIndex + 1 : (roleList || []).length + 1;

  // Platform-wide stats
  // Sum from donors only to avoid double/triple counting (same kg credited to donor, charity, and driver)
  const totalKg = (donors || []).reduce((sum, u) => sum + Number(u.total_kg_impact), 0);

  return (
    <div className="relative mx-auto max-w-5xl px-5 pt-6 pb-6 overflow-hidden lg:px-8 lg:pt-10 lg:pb-10">
      {/* Background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 rounded-full bg-brand-green/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 lg:mb-8 flex items-center justify-between animate-[fadeUp_0.6s_ease-out_both]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Community impact rankings</p>
        </div>
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-amber-100 shadow-sm">
          <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-amber-600" />
        </div>
      </div>

      {/* Your rank card */}
      <div className="relative mb-6 lg:mb-8 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        <div className="rounded-2xl border border-border bg-white p-4 lg:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Your Rank</p>
              <p className="text-3xl font-bold text-foreground">#{currentRank}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span className="text-lg font-bold text-foreground">{profile.total_points.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <Cloud className="h-4 w-4 text-brand-olive-green" />
                  <span className="text-lg font-bold text-foreground">{formatCO2e(profile.total_kg_impact)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">CO2e saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform impact summary */}
      <div className="relative mb-6 lg:mb-8 grid grid-cols-3 gap-3 animate-[fadeUp_0.6s_ease-out_0.15s_both]">
        <div className="rounded-2xl border border-border bg-white p-3 text-center shadow-sm">
          <Leaf className="mx-auto mb-1 h-5 w-5 text-brand-green" />
          <p className="text-lg font-bold text-foreground">{formatKg(totalKg)}</p>
          <p className="text-[10px] text-muted-foreground">Food Saved</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3 text-center shadow-sm">
          <Cloud className="mx-auto mb-1 h-5 w-5 text-brand-olive-green" />
          <p className="text-lg font-bold text-foreground">{formatCO2e(totalKg)}</p>
          <p className="text-[10px] text-muted-foreground">CO2e Avoided</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-3 text-center shadow-sm">
          <span className="mb-1 block text-lg">&#x1F372;</span>
          <p className="text-lg font-bold text-foreground">{formatMeals(totalKg)}</p>
          <p className="text-[10px] text-muted-foreground">Meals Saved</p>
        </div>
      </div>

      {/* Leaderboard tabs */}
      <div className="relative animate-[fadeUp_0.6s_ease-out_0.2s_both]">
        <LeaderboardTabs
          donors={addBadgeCount(donors)}
          charities={addBadgeCount(charities)}
          drivers={addBadgeCount(drivers)}
          currentUserId={user.id}
          currentUserRole={role}
        />
      </div>
    </div>
  );
}
