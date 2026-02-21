import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { DonationCard } from '@/components/DonationCard';
import { BottomNav } from '@/components/BottomNav';
import type { Donation, UserRole } from '@/lib/types';

export default async function HistoryPage() {
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

  // Build query based on role
  let query = supabase
    .from('donations')
    .select('*, donor:profiles!donations_donor_id_fkey(*)')
    .eq('status', 'delivered')
    .order('created_at', { ascending: false });

  if (role === 'donor') {
    query = query.eq('donor_id', user.id);
  } else if (role === 'charity') {
    query = query.eq('charity_id', user.id);
  } else {
    query = query.eq('driver_id', user.id);
  }

  const { data: deliveredDonations } = await query;

  const title = role === 'charity' ? 'Order History' : 'Delivery History';
  const emptyMessage = role === 'donor'
    ? 'Your completed donations will appear here'
    : role === 'charity'
    ? 'Your completed orders will appear here'
    : 'Your completed deliveries will appear here';

  const getHref = (id: string) => {
    if (role === 'donor') return `/donations/${id}`;
    if (role === 'charity') return `/offers/${id}`;
    return `/jobs/${id}`;
  };

  const totalDelivered = deliveredDonations?.length || 0;

  return (
    <div className="min-h-dvh bg-background pb-20 lg:pb-0 lg:pl-56">
      <div className="mx-auto max-w-4xl px-5 pt-6 lg:px-8 lg:pt-10">
        <div className="mb-6 lg:mb-8 animate-[fadeUp_0.6s_ease-out_both]">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h1>
        </div>

        {/* Summary stats */}
        {totalDelivered > 0 && (
          <div className="mb-5 lg:mb-8 flex gap-3 lg:gap-4 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-white p-3 lg:p-4 shadow-sm">
              <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg lg:text-xl font-bold text-foreground">{totalDelivered}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-white p-3 lg:p-4 shadow-sm">
              <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg bg-brand-green-light">
                <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-brand-green" />
              </div>
              <div>
                <p className="text-lg lg:text-xl font-bold text-foreground">{(totalDelivered * 5).toFixed(0)}{role === 'donor' ? 'kg' : ''}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">{role === 'driver' ? 'Miles' : 'Food saved'}</p>
              </div>
            </div>
          </div>
        )}

        {deliveredDonations && deliveredDonations.length > 0 ? (
          <div className="grid gap-3 lg:grid-cols-2 lg:gap-4 animate-[fadeUp_0.6s_ease-out_0.2s_both]">
            {(deliveredDonations as Donation[]).map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                href={getHref(donation.id)}
                showDonor={role !== 'donor'}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/50 p-8 lg:p-12 text-center animate-[fadeUp_0.6s_ease-out_0.1s_both]">
            <Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No history yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{emptyMessage}</p>
          </div>
        )}
      </div>
      <BottomNav role={role} />
    </div>
  );
}
