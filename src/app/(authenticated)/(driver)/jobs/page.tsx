import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Truck, Package, TrendingUp, MapPin } from 'lucide-react';
import { DonationCard } from '@/components/DonationCard';
import { SearchFilter } from '@/components/SearchFilter';
import { StatsCard } from '@/components/StatsCard';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import type { Donation } from '@/lib/types';

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'driver') redirect('/login');

  // Fetch all data in parallel
  const [{ data: availableJobs }, { data: activeJobs }, { count: totalJobs }, { count: deliveredCount }] = await Promise.all([
    supabase
      .from('donations')
      .select('*, donor:profiles!donations_donor_id_fkey(*)')
      .eq('status', 'accepted')
      .is('driver_id', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('donations')
      .select('*, donor:profiles!donations_donor_id_fkey(*), charity:profiles!donations_charity_id_fkey(*)')
      .eq('driver_id', user.id)
      .in('status', ['driver_assigned', 'picked_up'])
      .order('created_at', { ascending: false }),
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('driver_id', user.id),
    supabase
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('driver_id', user.id)
      .eq('status', 'delivered'),
  ]);

  const activeCount = activeJobs?.length || 0;
  const availableCount = availableJobs?.length || 0;

  return (
    <div className="relative px-5 pt-6 pb-6 overflow-hidden lg:px-8 lg:pt-10 lg:pb-10">
      <RealtimeRefresher table="donations" />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 rounded-full bg-brand-green/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 lg:mb-8 flex items-center justify-between animate-[fadeUp_0.6s_ease-out_both]">
        <div>
          <p className="text-sm lg:text-base text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{profile.name}</h1>
        </div>
        <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-blue-100 shadow-sm">
          <Truck className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
        </div>
      </div>

      {/* Stats */}
      <div className="relative mb-6 lg:mb-8 grid grid-cols-3 gap-3 lg:gap-4 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        <StatsCard
          label="Total Jobs"
          value={totalJobs || 0}
          icon={<Package className="h-4 w-4" />}
          accent="blue"
        />
        <StatsCard
          label="Delivered"
          value={deliveredCount || 0}
          icon={<Truck className="h-4 w-4" />}
          accent="blue"
        />
        <StatsCard
          label="Distance"
          value={`${((deliveredCount || 0) * 3.2).toFixed(0)}mi`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend="total"
          accent="blue"
        />
      </div>

      {/* Active Jobs */}
      {activeJobs && activeJobs.length > 0 && (
        <div className="relative mb-6 lg:mb-8 animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg lg:text-xl font-semibold text-foreground">My Active Jobs</h2>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
            {(activeJobs as Donation[]).map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                href={`/jobs/${donation.id}`}
                showDonor
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Jobs */}
      <div className="relative animate-[fadeUp_0.6s_ease-out_0.3s_both]">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Available Jobs</h2>
          {availableCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
              {availableCount}
            </span>
          )}
        </div>
        <SearchFilter
          donations={(availableJobs || []) as Donation[]}
          hrefPrefix="/jobs"
          showDonor
          emptyMessage="No available jobs"
          emptyIcon={<MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />}
        />
      </div>
    </div>
  );
}
