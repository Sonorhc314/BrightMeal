'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { DonationForm, type DonationFormData } from '@/components/DonationForm';

export default function PostDonationPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (data: DonationFormData) => {
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc('create_donation', {
      p_item_name: data.itemName,
      p_category: data.category,
      p_quantity: parseFloat(data.quantity),
      p_unit: data.unit,
      p_storage: data.storage,
      p_allergens: data.allergens.filter((a) => a !== 'None'),
      p_packaging: data.packaging,
      p_ready_by: new Date(data.readyBy).toISOString(),
      p_use_by: new Date(data.useBy).toISOString(),
      p_pickup_window_start: new Date(data.pickupStart).toISOString(),
      p_pickup_window_end: new Date(data.pickupEnd).toISOString(),
      p_pickup_location: data.pickupLocation,
      p_additional_notes: data.notes || null,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    router.push('/home');
    router.refresh();
  };

  return (
    <div className="relative mx-auto max-w-5xl px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-amber-500/[0.03] blur-3xl" />

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3 animate-[fadeUp_0.6s_ease-out_both]">
        <Link href="/home" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-border shadow-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Post Surplus Food</h1>
      </div>

      <DonationForm
        onSubmit={handleSubmit}
        submitLabel="Post Donation"
        submitting={loading}
        error={error}
      />
    </div>
  );
}
