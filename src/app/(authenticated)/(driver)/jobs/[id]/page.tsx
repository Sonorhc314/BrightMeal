'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline } from '@/components/StatusTimeline';
import {
  ArrowLeft, ArrowRight, MapPin, Clock, Package, Box,
  Phone, Loader2, Building2, Heart, CheckCircle2, Truck,
  Navigation, Snowflake, Thermometer, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { driverStatusConfig as statusConfig, categoryConfig, storageIcon, storageLabel, packagingLabel } from '@/lib/donation-config';
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

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

  const handleReport = async () => {
    if (!reportReason || !donation || !userId) return;
    setReportSubmitting(true);

    // Create a notification to the donor about the issue
    await supabase.from('notifications').insert({
      user_id: donation.donor_id,
      donation_id: donation.id,
      type: 'new_offer' as any, // reusing existing type
      title: 'Issue Reported with Donation',
      message: `Driver reported: ${reportReason}${reportNotes ? ` — ${reportNotes}` : ''}`,
    });

    setReportSubmitting(false);
    setReportSubmitted(true);
    setShowReportModal(false);
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
    <div className="relative mx-auto max-w-5xl px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
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
              {isMyJob && donation.donor.phone && (
                <p className="mt-1 text-xs text-muted-foreground">{donation.donor.phone}</p>
              )}
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
              {isMyJob && donation.charity.phone && (
                <p className="mt-1 text-xs text-muted-foreground">{donation.charity.phone}</p>
              )}
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
            {packagingLabel[donation.packaging]}
          </span>
        </div>
      </div>

      {/* Temperature Warning */}
      {(donation.storage === 'chilled' || donation.storage === 'frozen') && (
        <div className={`relative mb-4 flex items-center gap-3 rounded-2xl border p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.17s_both] ${
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

      {/* Food Safety Link */}
      <Link
        href="/food-safety"
        className="relative mb-4 flex items-center gap-3 rounded-2xl border border-brand-green/20 bg-brand-green-light p-3 shadow-sm transition-colors hover:bg-brand-green/10 animate-[fadeUp_0.6s_ease-out_0.18s_both]"
      >
        <ShieldCheck className="h-5 w-5 text-brand-green" />
        <span className="text-sm font-medium text-brand-green">View Food Safety Guidelines</span>
        <ArrowRight className="ml-auto h-4 w-4 text-brand-green/60" />
      </Link>

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
            <span className="text-muted-foreground">Collect before</span>
            <span className="font-medium text-foreground">
              {new Date(donation.pickup_window_end).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
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
          <StatusTimeline currentStatus={donation.status} events={events} deliveryMethod={donation.delivery_method} />
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
            className="h-12 w-full rounded-xl bg-blue-600 text-base font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
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

      {/* Report Issue */}
      {isMyJob && donation.status !== 'delivered' && donation.status !== 'cancelled' && (
        <div className="relative mt-3 animate-[fadeUp_0.6s_ease-out_0.35s_both]">
          {reportSubmitted ? (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-700">Issue reported successfully</p>
            </div>
          ) : (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <AlertTriangle className="h-4 w-4" />
              Report Food Safety Issue
            </button>
          )}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setShowReportModal(false)}>
          <div className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-lg font-bold text-foreground">Report an Issue</h3>
            <p className="mb-4 text-sm text-muted-foreground">Select the reason and add any details.</p>

            <div className="mb-4 space-y-2">
              {['Food appears damaged', 'Food has expired', 'Wrong items', 'Temperature concern', 'Packaging compromised', 'Other safety concern'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReportReason(reason)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                    reportReason === reason
                      ? 'border-red-300 bg-red-50 font-medium text-red-700'
                      : 'border-border bg-white text-foreground hover:bg-secondary'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Additional notes (optional)"
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              className="mb-4 w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-200"
              rows={2}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
