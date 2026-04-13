'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline } from '@/components/StatusTimeline';
import {
  ArrowLeft, MapPin, Clock, Package, AlertTriangle, Box,
  Phone, Loader2, ShieldCheck, Building2, Truck, Heart,
  Snowflake, Thermometer, User,
} from 'lucide-react';
import { statusConfig, categoryConfig, storageIcon, storageLabel } from '@/lib/donation-config';
import type { Donation, DonationEvent, DonationStatus, DonationCategory } from '@/lib/types';

export default function OfferDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [events, setEvents] = useState<DonationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [collecting, setCollecting] = useState(false);
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

  const handleAccept = async () => {
    if (!userId || !donation) return;
    setAccepting(true);

    const { error } = await supabase.rpc('accept_donation', {
      p_donation_id: donation.id,
    });

    if (error) {
      setAccepting(false);
      alert(error.message);
      return;
    }

    router.push('/offers');
    router.refresh();
  };

  const handleCollect = async () => {
    if (!userId || !donation) return;
    setCollecting(true);

    const { error } = await supabase.rpc('mark_charity_collected', {
      p_donation_id: donation.id,
    });

    if (error) {
      setCollecting(false);
      alert(error.message);
      return;
    }

    router.push('/offers');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="px-5 pt-4">
        <p className="text-muted-foreground">Donation not found</p>
      </div>
    );
  }

  const status = statusConfig[donation.status];
  const category = categoryConfig[donation.category as DonationCategory] || categoryConfig.other;
  const canAccept = donation.status === 'posted';
  const isMyOrder = donation.charity_id === userId;

  return (
    <div className="relative mx-auto max-w-5xl px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-purple/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-brand-green/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 animate-[fadeUp_0.6s_ease-out_both]">
        <Link href="/offers" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="flex-1 text-xl font-bold text-foreground">Offer Details</h1>
        <Badge variant="outline" className={`text-xs ${status.className}`}>{status.label}</Badge>
      </div>

      {/* Donor Info */}
      {donation.donor && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.05s_both]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{donation.donor.name}</p>
              <p className="text-sm text-muted-foreground">{donation.donor.business_type || 'Food Business'}</p>
              {donation.donor.food_hygiene_rating != null && (
                <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  donation.donor.food_hygiene_rating >= 4
                    ? 'bg-green-100 text-green-700'
                    : donation.donor.food_hygiene_rating === 3
                      ? 'bg-amber-100 text-amber-700'
                      : donation.donor.food_hygiene_rating === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                }`}>
                  {donation.donor.food_hygiene_rating === 5 && '\u2605 5 \u2014 Very Good'}
                  {donation.donor.food_hygiene_rating === 4 && '\u2605 4 \u2014 Good'}
                  {donation.donor.food_hygiene_rating === 3 && '\u2605 3 \u2014 Generally Satisfactory'}
                  {donation.donor.food_hygiene_rating === 2 && '\u2605 2 \u2014 Improvement Necessary'}
                  {donation.donor.food_hygiene_rating === 1 && '\u2605 1 \u2014 Major Improvement Necessary'}
                </span>
              )}
            </div>
            {isMyOrder && donation.donor.phone && (
              <a href={`tel:${donation.donor.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-light transition-colors hover:bg-brand-green/20">
                <Phone className="h-4 w-4 text-brand-green" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Item Info */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.1s_both]">
        <h2 className="mb-2 text-lg font-bold text-foreground">{donation.item_name}</h2>
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

        {donation.allergens && donation.allergens.length > 0 && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">Allergens:</span> {donation.allergens.join(', ')}
            </p>
          </div>
        )}

        {donation.additional_notes && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-medium">Notes:</span> {donation.additional_notes}
          </p>
        )}

        {donation.photo_url && (
          <div className="mt-3">
            <img
              src={donation.photo_url}
              alt={donation.item_name}
              className="w-full max-h-64 object-cover rounded-xl border border-border"
            />
          </div>
        )}
      </div>

      {/* Temperature Warning */}
      {(donation.storage === 'chilled' || donation.storage === 'frozen') && (
        <div className={`relative mb-4 flex items-center gap-3 rounded-2xl border p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.12s_both] ${
          donation.storage === 'frozen'
            ? 'border-blue-200 bg-blue-50'
            : 'border-cyan-200 bg-cyan-50'
        }`}>
          {donation.storage === 'frozen' ? (
            <Snowflake className="h-5 w-5 shrink-0 text-blue-600" />
          ) : (
            <Thermometer className="h-5 w-5 shrink-0 text-cyan-600" />
          )}
          <div>
            <p className={`text-sm font-semibold ${donation.storage === 'frozen' ? 'text-blue-700' : 'text-cyan-700'}`}>
              {donation.storage === 'frozen' ? 'Frozen Item — Maintain Cold Chain' : 'Chilled Item — Keep Refrigerated'}
            </p>
            <p className={`text-xs ${donation.storage === 'frozen' ? 'text-blue-600' : 'text-cyan-600'}`}>
              {donation.storage === 'frozen'
                ? 'Use insulated bags. Do not allow items to thaw during transport.'
                : 'Deliver within the pickup window. Do not leave in a warm vehicle.'}
            </p>
          </div>
        </div>
      )}

      {/* Timing */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.15s_both]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-foreground">Timing</h3>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Ready by</span>
            <span className="font-medium text-foreground">{new Date(donation.ready_by).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">{donation.date_type === 'best_before' ? 'Best before' : 'Use by'}</span>
            <span className="font-medium text-foreground">{new Date(donation.use_by).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-muted-foreground">Collect before</span>
            <span className="font-medium text-foreground">
              {new Date(donation.pickup_window_end).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.2s_both]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-purple-light">
            <MapPin className="h-3.5 w-3.5 text-brand-purple" />
          </div>
          <h3 className="font-semibold text-foreground">Pickup Location</h3>
        </div>
        <p className="text-sm text-muted-foreground">{donation.pickup_location}</p>
      </div>

      {/* Charity Self-Collection Info */}
      {donation.delivery_method === 'charity_pickup' && (
        <div className="relative mb-4 flex items-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.22s_both]">
          <User className="h-5 w-5 shrink-0 text-purple-600" />
          <div>
            <p className="text-sm font-semibold text-purple-700">Charity Self-Collection</p>
            <p className="text-xs text-purple-600">Your organisation will collect this donation directly from the donor.</p>
          </div>
        </div>
      )}

      {/* Driver Info */}
      {donation.driver && (
        <div className="relative mb-4 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.25s_both]">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
              <Truck className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground">Driver</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
              {donation.driver.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{donation.driver.name}</p>
              {donation.driver.vehicle_type && (
                <p className="text-sm text-muted-foreground">{donation.driver.vehicle_type}</p>
              )}
            </div>
            {isMyOrder && donation.driver.phone && (
              <a href={`tel:${donation.driver.phone}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors hover:bg-blue-200">
                <Phone className="h-4 w-4 text-blue-600" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      {(isMyOrder || donation.status !== 'posted') && (
        <div className="relative mb-6 rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.3s_both]">
          <h3 className="mb-4 font-semibold text-foreground">Timeline</h3>
          <StatusTimeline currentStatus={donation.status} events={events} deliveryMethod={donation.delivery_method} />
        </div>
      )}

      {/* Action Buttons */}
      {canAccept && (
        <div className="relative space-y-3 animate-[fadeUp_0.6s_ease-out_0.35s_both]">
          {/* Responsibility notice */}
          <div className="flex items-start gap-2 rounded-xl bg-brand-purple-light/50 p-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
            <p className="text-xs text-muted-foreground">
              By accepting, your organisation takes responsibility for safe food handling and distribution.
            </p>
          </div>

          <Button
            onClick={handleAccept}
            disabled={accepting}
            className="h-14 w-full rounded-xl bg-brand-olive-green text-base font-bold uppercase tracking-wider shadow-md shadow-brand-olive-green/20 hover:bg-brand-olive-green/90 active:scale-[0.98] transition-all"
          >
            {accepting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Accept Offer'}
          </Button>

          <Link href="/offers">
            <Button
              variant="outline"
              className="h-14 w-full rounded-xl border-2 border-brand-olive-green/30 bg-cream text-base font-bold uppercase tracking-wider text-brand-olive active:scale-[0.98] transition-all hover:bg-brand-olive-green/5"
            >
              Decline Offer
            </Button>
          </Link>
        </div>
      )}

      {/* Self-collection action */}
      {isMyOrder && donation.delivery_method === 'charity_pickup' && donation.status === 'accepted' && (
        <div className="relative space-y-3 animate-[fadeUp_0.6s_ease-out_0.35s_both]">
          <div className="flex items-start gap-2 rounded-xl bg-purple-50 p-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" />
            <p className="text-xs text-muted-foreground">
              Confirm that your organisation has collected this donation from the donor.
            </p>
          </div>

          <Button
            onClick={handleCollect}
            disabled={collecting}
            className="h-14 w-full rounded-xl bg-brand-olive-green text-base font-bold uppercase tracking-wider shadow-md shadow-brand-olive-green/20 hover:bg-brand-olive-green/90 active:scale-[0.98] transition-all"
          >
            {collecting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Mark as Collected'}
          </Button>
        </div>
      )}
    </div>
  );
}
