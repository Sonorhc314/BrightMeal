import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { HandHeart, Package, Heart, Cloud } from 'lucide-react';
import { DonationCard } from '@/components/DonationCard';
import { SearchFilter } from '@/components/SearchFilter';
import { StatsCard } from '@/components/StatsCard';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import { formatMeals } from '@/lib/gamification-config';
import type { Donation } from '@/lib/types';

export default async function OffersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'charity') redirect('/login');

  // Fetch all data in parallel
  const [{ data: availableOffers }, { data: activeOrders }, { count: totalAccepted }, { count: deliveredCount }] = await Promise.all([
    supabase
      .from('donations')
      .select('*, donor:profiles!donations_donor_id_fkey(*)')
      .eq('status', 'posted')
      .order('created_at', { ascending: false }),
    supabase
      .from('donations')
      .select('*, donor:profiles!donations_donor_id_fkey(*)')
      .eq('charity_id', user.id)
      .neq('status', 'delivered')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false }),
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('charity_id', user.id),
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('charity_id', user.id)
      .eq('status', 'delivered'),
  ]);

  const activeCount = activeOrders?.length || 0;
  const availableCount = availableOffers?.length || 0;

  return (
    <div className="relative mx-auto max-w-5xl px-5 pt-6 pb-6 overflow-hidden lg:px-8 lg:pt-10 lg:pb-10">
      <RealtimeRefresher table="donations" />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-purple/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 rounded-full bg-brand-green/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 lg:mb-8 flex items-center justify-between animate-[fadeUp_0.6s_ease-out_both]">
        <div>
          <p className="text-sm lg:text-base text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{profile.name}</h1>
        </div>
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-brand-purple-light shadow-sm">
          <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-brand-purple" />
        </div>
      </div>

      {/* Stats */}
      <div className="relative mb-6 lg:mb-8 grid grid-cols-3 gap-3 lg:gap-4 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        <StatsCard
          label="Accepted"
          value={totalAccepted || 0}
          icon={<HandHeart className="h-4 w-4" />}
          accent="purple"
        />
        <StatsCard
          label="Received"
          value={deliveredCount || 0}
          icon={<Package className="h-4 w-4" />}
          accent="purple"
        />
        <StatsCard
          label="Meals Saved"
          value={formatMeals(profile.total_kg_impact)}
          icon={<Cloud className="h-4 w-4 text-white/70" />}
          variant="impact"
        />
      </div>

      {/* Active Orders */}
      {activeOrders && activeOrders.length > 0 && (
        <div className="relative mb-6 lg:mb-8 animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">Active Orders</h2>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-purple px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {(activeOrders as Donation[]).map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                href={`/offers/${donation.id}`}
                showDonor
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Offers */}
      <div className="relative animate-[fadeUp_0.6s_ease-out_0.3s_both]">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Available Offers</h2>
          {availableCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
              {availableCount}
            </span>
          )}
        </div>
        <SearchFilter
          donations={(availableOffers || []) as Donation[]}
          hrefPrefix="/offers"
          showDonor
          emptyMessage="No available offers"
          emptyIcon={<HandHeart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />}
        />
      </div>
    </div>
  );
}
