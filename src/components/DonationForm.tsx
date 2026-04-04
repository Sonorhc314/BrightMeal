'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Loader2, Sparkles, Thermometer, Clock, MapPin, AlertTriangle,
} from 'lucide-react';
import {
  formCategories, formUnits, formStorageTypes, formPackagingTypes, allergenOptions,
} from '@/lib/donation-config';
import type { DonationCategory, DonationUnit, StorageType, PackagingType } from '@/lib/types';

export interface DonationFormData {
  itemName: string;
  category: DonationCategory;
  quantity: string;
  unit: DonationUnit;
  storage: StorageType;
  allergens: string[];
  packaging: PackagingType;
  dateType: 'use_by' | 'best_before';
  readyBy: string;
  useBy: string;
  pickupStart: string;
  pickupEnd: string;
  pickupLocation: string;
  notes: string;
  photoUrl: string;
}

interface DonationFormProps {
  defaultValues?: Partial<DonationFormData>;
  onSubmit: (data: DonationFormData) => Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
  error?: string;
  extraButtons?: React.ReactNode;
}

export function DonationForm({
  defaultValues = {},
  onSubmit,
  submitLabel = 'Post Donation',
  submitting = false,
  error,
  extraButtons,
}: DonationFormProps) {
  const [itemName, setItemName] = useState(defaultValues.itemName ?? '');
  const [category, setCategory] = useState<DonationCategory>(defaultValues.category ?? 'cooked_meals');
  const [quantity, setQuantity] = useState(defaultValues.quantity ?? '');
  const [unit, setUnit] = useState<DonationUnit>(defaultValues.unit ?? 'portions');
  const [storage, setStorage] = useState<StorageType>(defaultValues.storage ?? 'ambient');
  const [allergens, setAllergens] = useState<string[]>(defaultValues.allergens ?? []);
  const [packaging, setPackaging] = useState<PackagingType>(defaultValues.packaging ?? 'containers');
  const [dateType, setDateType] = useState<'use_by' | 'best_before'>(defaultValues.dateType ?? 'use_by');
  const [readyBy, setReadyBy] = useState(defaultValues.readyBy ?? '');
  const [useBy, setUseBy] = useState(defaultValues.useBy ?? '');
  const [pickupStart, setPickupStart] = useState(defaultValues.pickupStart ?? '');
  const [pickupEnd, setPickupEnd] = useState(defaultValues.pickupEnd ?? '');
  const [pickupLocation, setPickupLocation] = useState(defaultValues.pickupLocation ?? '');
  const [notes, setNotes] = useState(defaultValues.notes ?? '');
  const [photoUrl, setPhotoUrl] = useState(defaultValues.photoUrl ?? '');

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
    await onSubmit({
      itemName, category, quantity, unit, storage, allergens,
      packaging, dateType, readyBy, useBy, pickupStart, pickupEnd, pickupLocation, notes, photoUrl,
    });
  };

  return (
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
              {formCategories.map((c) => (
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
                {formUnits.map((u) => (
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
              {formStorageTypes.map((s) => (
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
              {formPackagingTypes.map((p) => (
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
          <div className="space-y-2">
            <Label>Date type</Label>
            <div className="flex gap-3">
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                dateType === 'use_by'
                  ? 'border-brand-green bg-brand-green-light text-brand-green'
                  : 'border-border bg-cream/50 text-muted-foreground'
              }`}>
                <input
                  type="radio"
                  name="dateType"
                  value="use_by"
                  checked={dateType === 'use_by'}
                  onChange={() => setDateType('use_by')}
                  className="sr-only"
                />
                Use by <span className="text-xs font-normal">(safety deadline)</span>
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                dateType === 'best_before'
                  ? 'border-brand-green bg-brand-green-light text-brand-green'
                  : 'border-border bg-cream/50 text-muted-foreground'
              }`}>
                <input
                  type="radio"
                  name="dateType"
                  value="best_before"
                  checked={dateType === 'best_before'}
                  onChange={() => setDateType('best_before')}
                  className="sr-only"
                />
                Best before <span className="text-xs font-normal">(quality date)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="readyBy">Ready from</Label>
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
              <Label htmlFor="useBy">{dateType === 'use_by' ? 'Use by' : 'Best before'}</Label>
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
              <Label htmlFor="pickupStart">Pickup window start</Label>
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
              <Label htmlFor="pickupEnd">Pickup window end</Label>
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

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo of items (optional)</Label>
            <Input
              id="photoUrl"
              placeholder="Paste an image URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="h-11 rounded-xl bg-cream/50"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive animate-[fadeUp_0.3s_ease-out_both]">
          {error}
        </p>
      )}

      <div className={`animate-[fadeUp_0.6s_ease-out_0.25s_both] ${extraButtons ? 'flex gap-3' : ''}`}>
        <Button
          type="submit"
          disabled={submitting}
          className={`h-12 rounded-xl bg-brand-green text-base font-semibold shadow-md shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all ${extraButtons ? 'flex-1' : 'w-full'}`}
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : submitLabel}
        </Button>
        {extraButtons}
      </div>
    </form>
  );
}
