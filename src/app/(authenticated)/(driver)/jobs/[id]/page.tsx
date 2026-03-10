'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline } from '@/components/StatusTimeline';
import {
  ArrowLeft, MapPin, Clock, Package, Box,
  Phone, Loader2, Building2, Heart, CheckCircle2, Truck,
  Navigation,
} from 'lucide-react';
import { driverStatusConfig as statusConfig, categoryConfig, storageIcon, storageLabel } from '@/lib/donation-config';
import type { Donation, DonationEvent, DonationStatus, DonationCategory } from '@/lib/types';

export default function JobDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [events, setEvents] = useState<DonationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const [{ data }, { data: eventsData }] = await Promise.all([
        supabase
          .from('donations')
          .select(`
            *,
            donor:profiles!donations_donor_id_fkey(*),
            charity:profiles!donations_charity_id_fkey(*),
            driver:profiles!donations_driver_id_fkey(*)
          `)
          .eq('id', id)
          .single(),
        supabase
          .from('donation_events')
          .select('*, actor:profiles!donation_events_actor_id_fkey(*)')
          .eq('donation_id', id)
          .order('created_at', { ascending: true }),
      ]);

      if (data) setDonation(data as unknown as Donation);
      if (eventsData) setEvents(eventsData as unknown as DonationEvent[]);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleAcceptJob = async () => {
    if (!userId || !donation) return;
    setActionLoading(true);

    const { error } = await supabase.rpc('assign_driver', {
      p_donation_id: donation.id,
    });

    if (error) {
      setActionLoading(false);
      alert(error.message);
      return;
    }

    router.push('/jobs');
    router.refresh();
  };

  const handlePickedUp = async () => {
    if (!userId || !donation) return;
    setActionLoading(true);

    const { error } = await supabase.rpc('mark_picked_up', {
      p_donation_id: donation.id,
    });

    if (error) {
      setActionLoading(false);
      return;
    }

    setDonation((prev) => prev ? { ...prev, status: 'picked_up' } : null);
    setEvents((prev) => [...prev, {
      id: crypto.randomUUID(),
      donation_id: donation.id,
      status: 'picked_up' as DonationStatus,
      actor_id: userId,
      created_at: new Date().toISOString(),
    }]);
    setActionLoading(false);
  };

  const handleDelivered = async () => {
    if (!userId || !donation) return;
    setActionLoading(true);

    const { error } = await supabase.rpc('mark_delivered', {
      p_donation_id: donation.id,
    });

    if (error) {
      setActionLoading(false);
      return;
    }

    router.push('/jobs');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="px-5 pt-4">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const status = statusConfig[donation.status];
  const category = categoryConfig[donation.category as DonationCategory] || categoryConfig.other;
  const canAcceptJob = donation.status === 'accepted' && !donation.driver_id;
  const isMyJob = donation.driver_id === userId;
  const canMarkPickedUp = isMyJob && donation.status === 'driver_assigned';
  const canMarkDelivered = isMyJob && donation.status === 'picked_up';

  return (
    <div className="relative px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-brand-green/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 animate-[fadeUp_0.6s_ease-out_both]">
        <Link href="/jobs" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 text-xl font-bold text-foreground">Job Details</h1>
        <Badge variant="outline" className={`text-xs ${status.className}`}>{status.label}</Badge>
      </div>

      {/* Donor Info */}
      {donation.donor && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.05s_both]">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Pickup From</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{donation.donor.name}</p>
              <p className="text-sm text-muted-foreground">{donation.pickup_location}</p>
            </div>
            {isMyJob && donation.donor.phone && (
              <a href={`tel:${donation.donor.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light transition-colors hover:bg-brand-green/20">
                <Phone className="h-5 w-5 text-brand-green" />
              </a>
            )}
          </div>
          {isMyJob && (
            <button
              onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(donation.pickup_location)}`, '_blank')}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-green/20 bg-brand-green-light px-3 py-2 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green/20"
            >
              <Navigation className="h-4 w-4" />
              Navigate to Pickup
            </button>
          )}
        </div>
      )}

      {/* Charity Info */}
      {donation.charity && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.1s_both]">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">Deliver To</h3>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light text-brand-purple">
              <Heart className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{donation.charity.name}</p>
              <p className="text-sm text-muted-foreground">{donation.charity.location || 'Location TBD'}</p>
            </div>
            {isMyJob && donation.charity.phone && (
              <a href={`tel:${donation.charity.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple-light transition-colors hover:bg-brand-purple/20">
                <Phone className="h-5 w-5 text-brand-purple" />
              </a>
            )}
          </div>
          {isMyJob && donation.charity.location && (
            <button
              onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(donation.charity!.location!)}`, '_blank')}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-purple/20 bg-brand-purple-light px-3 py-2 text-sm font-medium text-brand-purple transition-colors hover:bg-brand-purple/20"
            >
              <Navigation className="h-4 w-4" />
              Navigate to Delivery
            </button>
          )}
        </div>
      )}

      {/* Item Info */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.15s_both]">
        <h3 className="mb-2 font-semibold text-foreground">Package Details</h3>
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${category.color}`}>
            {category.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            <Package className="h-3 w-3" />
            {donation.quantity} {donation.unit}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            {storageIcon[donation.storage]}
            {storageLabel[donation.storage]}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
            <Box className="h-3 w-3" />
            {donation.packaging}
          </span>
        </div>
      </div>

      {/* Timing */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.2s_both]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-foreground">Timing</h3>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Pickup window</span>
            <span className="font-medium text-foreground">
              {new Date(donation.pickup_window_start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(donation.pickup_window_end).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{donation.pickup_location}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {isMyJob && (
        <div className="relative mb-6 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.25s_both]">
          <h3 className="mb-4 font-semibold text-foreground">Timeline</h3>
          <StatusTimeline currentStatus={donation.status} events={events} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="relative space-y-3 animate-[fadeUp_0.6s_ease-out_0.3s_both]">
        {canAcceptJob && (
          <>
            <Button
              onClick={handleAcceptJob}
              disabled={actionLoading}
              className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              {actionLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Truck className="mr-2 h-5 w-5" />
                  Accept Job
                </>
              )}
            </Button>
            <Link href="/jobs">
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-border text-base font-semibold active:scale-[0.98] transition-all"
              >
                Back to Jobs
              </Button>
            </Link>
          </>
        )}

        {canMarkPickedUp && (
          <Button
            onClick={handlePickedUp}
            disabled={actionLoading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Package className="mr-2 h-5 w-5" />
                Mark as Picked Up
              </>
            )}
          </Button>
        )}

        {canMarkDelivered && (
          <Button
            onClick={handleDelivered}
            disabled={actionLoading}
            className="h-12 w-full rounded-xl bg-gradient-to-r from-brand-green to-emerald-600 text-base font-semibold shadow-md shadow-brand-green/20 hover:from-brand-green/90 hover:to-emerald-700 active:scale-[0.98] transition-all"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Mark as Delivered
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
