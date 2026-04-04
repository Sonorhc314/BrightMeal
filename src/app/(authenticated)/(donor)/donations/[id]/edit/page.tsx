'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { DonationForm, type DonationFormData } from '@/components/DonationForm';
import type { Donation } from '@/lib/types';

function toLocalDatetime(iso: string) {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export default function EditDonationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [defaultValues, setDefaultValues] = useState<Partial<DonationFormData>>({});

  useEffect(() => {
    const fetchDonation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('donations')
        .select('*')
        .eq('id', id)
        .single();

      if (!data || data.status !== 'posted' || data.donor_id !== user.id) {
        router.replace(`/donations/${id}`);
        return;
      }

      const donation = data as unknown as Donation;
      setDefaultValues({
        itemName: donation.item_name,
        category: donation.category,
        quantity: String(donation.quantity),
        unit: donation.unit,
        storage: donation.storage,
        allergens: donation.allergens.length > 0 ? donation.allergens : [],
        packaging: donation.packaging,
        dateType: donation.date_type || 'use_by',
        readyBy: toLocalDatetime(donation.ready_by),
        useBy: toLocalDatetime(donation.use_by),
        pickupStart: toLocalDatetime(donation.pickup_window_start),
        pickupEnd: toLocalDatetime(donation.pickup_window_end),
        pickupLocation: donation.pickup_location,
        notes: donation.additional_notes || '',
        photoUrl: donation.photo_url || '',
      });
      setLoading(false);
    };

    fetchDonation();
  }, [id]);

  const handleSubmit = async (data: DonationFormData) => {
    setSaving(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in');
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('donations')
      .update({
        item_name: data.itemName,
        category: data.category,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        storage: data.storage,
        allergens: data.allergens.filter((a) => a !== 'None'),
        packaging: data.packaging,
        date_type: data.dateType,
        ready_by: new Date(data.readyBy).toISOString(),
        use_by: new Date(data.useBy).toISOString(),
        pickup_window_start: new Date(data.pickupStart).toISOString(),
        pickup_window_end: new Date(data.pickupEnd).toISOString(),
        pickup_location: data.pickupLocation,
        additional_notes: data.notes || null,
        photo_url: data.photoUrl || null,
      })
      .eq('id', id)
      .eq('donor_id', user.id)
      .eq('status', 'posted');

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push(`/donations/${id}`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-5xl px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-amber-500/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 animate-[fadeUp_0.6s_ease-out_both]">
        <Link href={`/donations/${id}`} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Edit Donation</h1>
      </div>

      <DonationForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        submitting={saving}
        error={error}
        extraButtons={
          <Link href={`/donations/${id}`}>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-border text-base font-semibold active:scale-[0.98] transition-all"
            >
              Cancel
            </Button>
          </Link>
        }
      />
    </div>
  );
}
