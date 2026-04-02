import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Clock, CheckCircle2, Cloud } from 'lucide-react';
import { SearchFilter } from '@/components/SearchFilter';
import { formatCO2e } from '@/lib/gamification-config';
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

  const hrefPrefix = role === 'donor' ? '/donations' : role === 'charity' ? '/offers' : '/jobs';

  const totalDelivered = deliveredDonations?.length || 0;

  return (
    <div className="px-5 pt-6 lg:px-8 lg:pt-10">
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
                <Cloud className="h-4 w-4 lg:h-5 lg:w-5 text-brand-green" />
              </div>
              <div>
                <p className="text-lg lg:text-xl font-bold text-foreground">{formatCO2e(profile.total_kg_impact)}</p>
                <p className="text-xs lg:text-sm text-muted-foreground">CO2e saved</p>
              </div>
            </div>
          </div>
        )}

        <div className="animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          <SearchFilter
            donations={(deliveredDonations || []) as Donation[]}
            hrefPrefix={hrefPrefix}
            showDonor={role !== 'donor'}
            emptyMessage={emptyMessage}
            emptyIcon={<Clock className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />}
          />
        </div>
    </div>
  );
}
