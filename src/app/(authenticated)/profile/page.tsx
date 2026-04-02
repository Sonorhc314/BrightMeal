import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Package, Heart, HandHeart, Truck, Cloud,
  Flame, MapPin, Trophy,
} from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import { ProfileEditor } from '@/components/ProfileEditor';
import { BadgeGrid } from '@/components/BadgeGrid';
import { formatCO2e, formatMeals } from '@/lib/gamification-config';
import type { UserRole, Profile, UserBadge } from '@/lib/types';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  const role = profile.role as UserRole;
  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  // Stats + badges + rank queries (parallelized)
  const roleColumn = role === 'donor' ? 'donor_id' : role === 'charity' ? 'charity_id' : 'driver_id';
  const [{ count: t }, { count: d }, { data: earnedBadges }, { count: usersAbove }] = await Promise.all([
    supabase.from('donations').select('*', { count: 'exact', head: true }).eq(roleColumn, user.id),
    supabase.from('donations').select('*', { count: 'exact', head: true }).eq(roleColumn, user.id).eq('status', 'delivered'),
    supabase.from('user_badges').select('*').eq('user_id', user.id),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', role).gt('total_points', profile.total_points),
  ]);
  const totalCount = t || 0;
  const deliveredCount = d || 0;
  const currentRank = (usersAbove || 0) + 1;

  const avatarGradient = role === 'donor'
    ? 'from-brand-green to-emerald-600'
    : role === 'charity'
    ? 'from-brand-purple to-violet-600'
    : 'from-blue-500 to-blue-700';

  const accentBg = role === 'donor' ? 'bg-brand-green-light' : role === 'charity' ? 'bg-brand-purple-light' : 'bg-blue-100';
  const accentText = role === 'donor' ? 'text-brand-green' : role === 'charity' ? 'text-brand-purple' : 'text-blue-600';

  const impactValue = role === 'driver'
    ? formatCO2e(profile.total_kg_impact)
    : role === 'donor'
    ? formatCO2e(profile.total_kg_impact)
    : formatMeals(profile.total_kg_impact);

  const impactLabel = role === 'driver'
    ? 'CO2e Saved'
    : role === 'donor'
    ? 'CO2e Saved'
    : 'Meals';

  return (
    <>
      {/* Gradient Profile Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${avatarGradient} px-5 pb-8 pt-8 lg:px-8 lg:pb-10 lg:pt-12`}>
          <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
          <div className="relative flex flex-col items-center text-center animate-[fadeUp_0.6s_ease-out_both] lg:flex-row lg:items-center lg:text-left lg:gap-6">
            <div className="mb-3 lg:mb-0 flex h-20 w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-white/20 text-3xl lg:text-4xl font-bold text-white shadow-lg backdrop-blur-sm shrink-0">
              {initial}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-sm lg:text-base text-white/70">{profile.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                {role === 'donor' && profile.business_type && (
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {profile.business_type}
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Flame className="h-3 w-3 text-amber-400" />
                  {profile.total_points.toLocaleString()} pts
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Trophy className="h-3 w-3 text-amber-400" />
                  Rank #{currentRank}
                </span>
                {profile.current_streak >= 2 && (
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    &#x1F525; {profile.current_streak}w streak
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-0.5 text-xs text-white/70">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-6 lg:px-8 lg:pt-8">
          {/* Single-column layout: Stats → Badges → Account Details → Logout */}
          <div className="space-y-5 lg:space-y-6">
            {/* Impact Stats */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.1s_both]">
              <div className="rounded-2xl border border-border bg-white p-4 lg:p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Your Impact</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${accentBg}`}>
                      {role === 'donor' ? <Package className={`h-5 w-5 ${accentText}`} /> : role === 'charity' ? <HandHeart className={`h-5 w-5 ${accentText}`} /> : <Package className={`h-5 w-5 ${accentText}`} />}
                    </div>
                    <p className="text-xl font-bold text-foreground">{totalCount}</p>
                    <p className="text-xs text-muted-foreground">{role === 'donor' ? 'Posted' : role === 'charity' ? 'Accepted' : 'Jobs'}</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${accentBg}`}>
                      {role === 'driver' ? <Truck className={`h-5 w-5 ${accentText}`} /> : <Heart className={`h-5 w-5 ${accentText}`} />}
                    </div>
                    <p className="text-xl font-bold text-foreground">{deliveredCount}</p>
                    <p className="text-xs text-muted-foreground">{role === 'driver' ? 'Completed' : 'Delivered'}</p>
                  </div>
                  <div className="text-center">
                    <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${accentBg}`}>
                      <Cloud className={`h-5 w-5 ${accentText}`} />
                    </div>
                    <p className="text-xl font-bold text-foreground">{impactValue}</p>
                    <p className="text-xs text-muted-foreground">{impactLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.12s_both]">
              <div className="rounded-2xl border border-border bg-white p-4 lg:p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  Your Badges
                  {(earnedBadges || []).length > 0 && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {(earnedBadges || []).length} earned
                    </span>
                  )}
                </h2>
                <BadgeGrid role={role} earnedBadges={(earnedBadges || []) as UserBadge[]} />
              </div>
            </div>

            {/* Account Details */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.15s_both]">
              <ProfileEditor
                profile={profile as unknown as Profile}
                role={role}
                accentBg={accentBg}
                accentText={accentText}
              />
            </div>

            {/* Logout */}
            <div className="animate-[fadeUp_0.6s_ease-out_0.2s_both]">
              <LogoutButton />
            </div>
          </div>
      </div>
    </>
  );
}
