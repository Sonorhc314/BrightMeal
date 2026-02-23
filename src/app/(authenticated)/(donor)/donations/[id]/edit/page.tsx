'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, Loader2, Sparkles, Snowflake, Thermometer, Sun,
  Clock, MapPin, Box, AlertTriangle,
} from 'lucide-react';
import type { Donation, DonationCategory, DonationUnit, StorageType, PackagingType } from '@/lib/types';

const categories: { value: DonationCategory; label: string; color: string }[] = [
  { value: 'cooked_meals', label: 'Cooked Meals', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'fresh_produce', label: 'Fresh Produce', color: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'bakery', label: 'Bakery', color: 'border-amber-400 bg-amber-50 text-amber-700' },
  { value: 'dairy', label: 'Dairy', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  { value: 'other', label: 'Other', color: 'border-gray-400 bg-gray-50 text-gray-700' },
];

const units: { value: DonationUnit; label: string }[] = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'pieces', label: 'Pieces' },
  { value: 'portions', label: 'Portions' },
  { value: 'cans', label: 'Cans' },
];

const storageTypes: { value: StorageType; label: string; icon: React.ReactNode; activeColor: string }[] = [
  { value: 'ambient', label: 'Ambient', icon: <Sun className="h-4 w-4" />, activeColor: 'border-amber-400 bg-amber-50 text-amber-700' },
  { value: 'chilled', label: 'Chilled', icon: <Thermometer className="h-4 w-4" />, activeColor: 'border-cyan-400 bg-cyan-50 text-cyan-700' },
  { value: 'frozen', label: 'Frozen', icon: <Snowflake className="h-4 w-4" />, activeColor: 'border-blue-400 bg-blue-50 text-blue-700' },
];

const packagingTypes: { value: PackagingType; label: string }[] = [
  { value: 'boxed', label: 'Boxed' },
  { value: 'bagged', label: 'Bagged' },
  { value: 'loose', label: 'Loose' },
  { value: 'containers', label: 'Containers' },
];

const allergenOptions = [
  'Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Sesame', 'None',
];

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

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<DonationCategory>('cooked_meals');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<DonationUnit>('portions');
  const [storage, setStorage] = useState<StorageType>('ambient');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [packaging, setPackaging] = useState<PackagingType>('containers');
  const [readyBy, setReadyBy] = useState('');
  const [useBy, setUseBy] = useState('');
  const [pickupStart, setPickupStart] = useState('');
  const [pickupEnd, setPickupEnd] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');

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
      setItemName(donation.item_name);
      setCategory(donation.category);
      setQuantity(String(donation.quantity));
      setUnit(donation.unit);
      setStorage(donation.storage);
      setAllergens(donation.allergens.length > 0 ? donation.allergens : []);
      setPackaging(donation.packaging);
      setReadyBy(toLocalDatetime(donation.ready_by));
      setUseBy(toLocalDatetime(donation.use_by));
      setPickupStart(toLocalDatetime(donation.pickup_window_start));
      setPickupEnd(toLocalDatetime(donation.pickup_window_end));
      setPickupLocation(donation.pickup_location);
      setNotes(donation.additional_notes || '');
      setLoading(false);
    };

    fetchDonation();
  }, [id]);

  const toggleAllergen = (allergen: string) => {
    if (allergen === 'None') {
      setAllergens(['None']);
      return;
    }
    setAllergens((prev) => {
      const filtered = prev.filter((a) => a !== 'None');
      return filtered.includes(allergen)
        ? filtered.filter((a) => a !== allergen)
        : [...filtered, allergen];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { error: updateError } = await supabase
      .from('donations')
      .update({
        item_name: itemName,
        category,
        quantity: parseFloat(quantity),
        unit,
        storage,
        allergens: allergens.filter((a) => a !== 'None'),
        packaging,
        ready_by: new Date(readyBy).toISOString(),
        use_by: new Date(useBy).toISOString(),
        pickup_window_start: new Date(pickupStart).toISOString(),
        pickup_window_end: new Date(pickupEnd).toISOString(),
        pickup_location: pickupLocation,
        additional_notes: notes || null,
      })
      .eq('id', id);

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
    <div className="relative px-5 pt-4 pb-8 overflow-hidden lg:px-8 lg:pt-8 lg:pb-10">
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

      <form onSubmit={handleSubmit} className="relative space-y-5">
        {/* Item Details Section */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.05s_both]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light">
              <Sparkles className="h-4 w-4 text-brand-green" />
            </div>
            <h2 className="font-semibold text-foreground">Item Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item name</Label>
              <Input
                id="itemName"
                placeholder="e.g. Assorted Sandwiches"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                className="h-11 rounded-xl bg-cream/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-[0.96] ${
                      category === c.value
                        ? c.color
                        : 'border-border bg-cream/50 text-muted-foreground hover:border-border/80'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 20"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-cream/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {units.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUnit(u.value)}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-all active:scale-[0.96] ${
                        unit === u.value
                          ? 'border-brand-green bg-brand-green-light text-brand-green'
                          : 'border-border bg-cream/50 text-muted-foreground'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage & Handling */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.1s_both]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100">
              <Thermometer className="h-4 w-4 text-cyan-600" />
            </div>
            <h2 className="font-semibold text-foreground">Storage & Handling</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Storage type</Label>
              <div className="flex gap-2">
                {storageTypes.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStorage(s.value)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.96] ${
                      storage === s.value
                        ? s.activeColor
                        : 'border-border bg-cream/50 text-muted-foreground'
                    }`}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Packaging</Label>
              <div className="grid grid-cols-2 gap-2">
                {packagingTypes.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPackaging(p.value)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.96] ${
                      packaging === p.value
                        ? 'border-brand-green bg-brand-green-light text-brand-green'
                        : 'border-border bg-cream/50 text-muted-foreground'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {allergenOptions.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all active:scale-[0.96] ${
                      allergens.includes(a)
                        ? a === 'None'
                          ? 'border-brand-green bg-brand-green-light text-brand-green'
                          : 'border-red-300 bg-red-50 text-red-700 shadow-sm shadow-red-100'
                        : 'border-border bg-cream/50 text-muted-foreground'
                    }`}
                  >
                    {a !== 'None' && allergens.includes(a) && (
                      <AlertTriangle className="mr-1 inline h-3 w-3" />
                    )}
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timing */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.15s_both]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="font-semibold text-foreground">Timing</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="readyBy">Ready by</Label>
                <Input
                  id="readyBy"
                  type="datetime-local"
                  value={readyBy}
                  onChange={(e) => setReadyBy(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-cream/50 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="useBy">Use by</Label>
                <Input
                  id="useBy"
                  type="datetime-local"
                  value={useBy}
                  onChange={(e) => setUseBy(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-cream/50 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pickupStart">Pickup from</Label>
                <Input
                  id="pickupStart"
                  type="datetime-local"
                  value={pickupStart}
                  onChange={(e) => setPickupStart(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-cream/50 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupEnd">Pickup until</Label>
                <Input
                  id="pickupEnd"
                  type="datetime-local"
                  value={pickupEnd}
                  onChange={(e) => setPickupEnd(e.target.value)}
                  required
                  className="h-11 rounded-xl bg-cream/50 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm animate-[fadeUp_0.6s_ease-out_0.2s_both]">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green-light">
              <MapPin className="h-4 w-4 text-brand-green" />
            </div>
            <h2 className="font-semibold text-foreground">Pickup Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup location</Label>
              <Input
                id="pickupLocation"
                placeholder="e.g. 12 High Street, Bath, BA1 1AA"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="h-11 rounded-xl bg-cream/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g. Use the side entrance, ask for the manager"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="rounded-xl bg-cream/50"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive animate-[fadeUp_0.3s_ease-out_both]">
            {error}
          </p>
        )}

        <div className="flex gap-3 animate-[fadeUp_0.6s_ease-out_0.25s_both]">
          <Button
            type="submit"
            disabled={saving}
            className="h-12 flex-1 rounded-xl bg-brand-green text-base font-semibold shadow-md shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
          </Button>
          <Link href={`/donations/${id}`}>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl border-border text-base font-semibold active:scale-[0.98] transition-all"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
