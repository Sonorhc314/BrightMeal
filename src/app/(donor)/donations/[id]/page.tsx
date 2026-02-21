import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Clock, Package, Thermometer, AlertTriangle, Box,
  Phone, Snowflake, Sun, Heart, Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import type { Donation, DonationEvent, DonationStatus, DonationCategory } from '@/lib/types';

const statusConfig: Record<DonationStatus, { label: string; className: string }> = {
  posted: { label: 'Available', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  accepted: { label: 'Accepted', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  driver_assigned: { label: 'Driver Assigned', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  picked_up: { label: 'Picked Up', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200' },
};

const categoryConfig: Record<DonationCategory, { label: string; color: string }> = {
  cooked_meals: { label: 'Cooked Meals', color: 'bg-orange-100 text-orange-700' },
  fresh_produce: { label: 'Fresh Produce', color: 'bg-green-100 text-green-700' },
  bakery: { label: 'Bakery', color: 'bg-amber-100 text-amber-700' },
  dairy: { label: 'Dairy', color: 'bg-blue-100 text-blue-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700' },
};

const storageIcon: Record<string, React.ReactNode> = {
  frozen: <Snowflake className="h-3.5 w-3.5 text-blue-500" />,
  chilled: <Thermometer className="h-3.5 w-3.5 text-cyan-500" />,
  ambient: <Sun className="h-3.5 w-3.5 text-amber-500" />,
};

const storageLabel: Record<string, string> = {
  frozen: 'Frozen',
  chilled: 'Chilled',
  ambient: 'Ambient',
};

export default async function DonationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: donation } = await supabase
    .from('donations')
    .select(`
      *,
      donor:profiles!donations_donor_id_fkey(*),
      charity:profiles!donations_charity_id_fkey(*),
      driver:profiles!donations_driver_id_fkey(*)
    `)
    .eq('id', id)
    .single();

  if (!donation) notFound();

  const { data: events } = await supabase
    .from('donation_events')
    .select('*, actor:profiles!donation_events_actor_id_fkey(*)')
    .eq('donation_id', id)
    .order('created_at', { ascending: true });

  const typedDonation = donation as unknown as Donation;
  const typedEvents = (events || []) as unknown as DonationEvent[];
  const status = statusConfig[typedDonation.status];
  const category = categoryConfig[typedDonation.category as DonationCategory] || categoryConfig.other;

  return (
    <div className="relative px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
      <RealtimeRefresher table="donations" filter={`id=eq.${id}`} />

      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-amber-500/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 animate-[fadeUp_0.6s_ease-out_both]">
        <Link href="/home" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 text-xl font-bold text-foreground">Donation Details</h1>
        <Badge variant="outline" className={`text-xs ${status.className}`}>{status.label}</Badge>
      </div>

      {/* Item Info */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.05s_both]">
        <h2 className="mb-2 text-lg font-bold text-foreground">{typedDonation.item_name}</h2>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${category.color}`}>
            {category.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            <Package className="h-3 w-3" />
            {typedDonation.quantity} {typedDonation.unit}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            {storageIcon[typedDonation.storage]}
            {storageLabel[typedDonation.storage]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            <Box className="h-3 w-3" />
            {typedDonation.packaging}
          </span>
        </div>

        {typedDonation.allergens && typedDonation.allergens.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">Allergens:</span> {typedDonation.allergens.join(', ')}
            </p>
          </div>
        )}

        {typedDonation.additional_notes && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium">Notes:</span> {typedDonation.additional_notes}
          </p>
        )}
      </div>

      {/* Timing */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-foreground">Timing</h3>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Ready by</span>
            <span className="font-medium text-foreground">{new Date(typedDonation.ready_by).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Use by</span>
            <span className="font-medium text-foreground">{new Date(typedDonation.use_by).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Pickup window</span>
            <span className="font-medium text-foreground">
              {new Date(typedDonation.pickup_window_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(typedDonation.pickup_window_end).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.15s_both]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green-light">
            <MapPin className="h-3.5 w-3.5 text-brand-green" />
          </div>
          <h3 className="font-semibold text-foreground">Pickup Location</h3>
        </div>
        <p className="text-sm text-muted-foreground">{typedDonation.pickup_location}</p>
      </div>

      {/* Charity Info (if accepted) */}
      {typedDonation.charity && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-purple-light">
              <Heart className="h-3.5 w-3.5 text-brand-purple" />
            </div>
            <h3 className="font-semibold text-foreground">Accepted By</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light text-brand-purple font-bold">
              {typedDonation.charity.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{typedDonation.charity.name}</p>
              {typedDonation.charity.location && (
                <p className="text-sm text-muted-foreground">{typedDonation.charity.location}</p>
              )}
            </div>
            {typedDonation.charity.phone && (
              <a href={`tel:${typedDonation.charity.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light transition-colors hover:bg-brand-purple/20">
                <Phone className="h-4 w-4 text-brand-purple" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Driver Info (if assigned) */}
      {typedDonation.driver && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.25s_both]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
              <Truck className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground">Driver</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
              {typedDonation.driver.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{typedDonation.driver.name}</p>
              {typedDonation.driver.vehicle_type && (
                <p className="text-sm text-muted-foreground">{typedDonation.driver.vehicle_type}</p>
              )}
            </div>
            {typedDonation.driver.phone && (
              <a href={`tel:${typedDonation.driver.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200">
                <Phone className="h-4 w-4 text-blue-600" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div className="relative rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.3s_both]">
        <h3 className="mb-4 font-semibold text-foreground">Timeline</h3>
        <StatusTimeline
          currentStatus={typedDonation.status}
          events={typedEvents}
        />
      </div>
    </div>
  );
}
