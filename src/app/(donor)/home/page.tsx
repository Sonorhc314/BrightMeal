import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Package, TrendingUp, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonationCard } from '@/components/DonationCard';
import { StatsCard } from '@/components/StatsCard';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import type { Donation } from '@/lib/types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default async function DonorHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'donor') redirect('/login');

  // Get active donations (not delivered)
  const { data: activeDonations } = await supabase
    .from('donations')
    .select('*, donor:profiles!donations_donor_id_fkey(*)')
    .eq('donor_id', user.id)
    .neq('status', 'delivered')
    .order('created_at', { ascending: false });

  // Get stats
  const { count: totalDonations } = await supabase
    .from('donations')
    .select('*', { count: 'exact', head: true })
    .eq('donor_id', user.id);

  const { count: deliveredCount } = await supabase
    .from('donations')
    .select('*', { count: 'exact', head: true })
    .eq('donor_id', user.id)
    .eq('status', 'delivered');

  const activeCount = activeDonations?.length || 0;

  return (
    <div className="relative px-5 pt-6 pb-6 overflow-hidden lg:px-8 lg:pt-10 lg:pb-10">
      <RealtimeRefresher table="donations" filter={`donor_id=eq.${user.id}`} />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 rounded-full bg-brand-purple/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 lg:mb-8 flex items-center justify-between animate-[fadeUp_0.6s_ease-out_both]">
        <div>
          <p className="text-sm lg:text-base text-muted-foreground">{getGreeting()},</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{profile.name}</h1>
        </div>
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-brand-green-light shadow-sm">
          <Leaf className="h-5 w-5 lg:h-6 lg:w-6 text-brand-green" />
        </div>
      </div>

      {/* Top row: Stats + CTA side by side on desktop */}
      <div className="relative mb-6 lg:mb-8 lg:flex lg:items-start lg:gap-6 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        {/* Impact Stats */}
        <div className="grid grid-cols-3 gap-3 lg:gap-4 lg:flex-1">
          <StatsCard
            label="Total Posted"
            value={totalDonations || 0}
            icon={<Package className="h-4 w-4" />}
            accent="green"
          />
          <StatsCard
            label="Delivered"
            value={deliveredCount || 0}
            icon={<Heart className="h-4 w-4" />}
            accent="green"
          />
          <StatsCard
            label="Impact"
            value={`${((deliveredCount || 0) * 5).toFixed(0)}kg`}
            icon={<TrendingUp className="h-4 w-4" />}
            trend="saved"
            accent="green"
          />
        </div>

        {/* Post New Button — inline on desktop */}
        <Link href="/post" className="mt-4 block lg:mt-0 lg:shrink-0">
          <Button className="h-12 w-full lg:w-auto lg:px-8 rounded-xl bg-brand-green text-base font-semibold shadow-md shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all">
            <Plus className="mr-2 h-5 w-5" />
            Post Surplus Food
          </Button>
        </Link>
      </div>

      {/* Active Pickups */}
      <div className="relative animate-[fadeUp_0.6s_ease-out_0.3s_both]">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Active Pickups</h2>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeDonations && activeDonations.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {(activeDonations as Donation[]).map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                href={`/donations/${donation.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/50 p-8 lg:p-12 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No active pickups</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Post surplus food to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
