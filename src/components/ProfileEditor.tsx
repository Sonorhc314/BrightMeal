'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Phone, MapPin, Building2, Car, CreditCard, Mail, Pencil, Loader2, Check, ShieldCheck,
} from 'lucide-react';
import type { Profile, UserRole } from '@/lib/types';

interface ProfileEditorProps {
  profile: Profile;
  role: UserRole;
  accentBg: string;
  accentText: string;
}

export function ProfileEditor({ profile, role, accentBg, accentText }: ProfileEditorProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || '');
  const [location, setLocation] = useState(profile.location || '');
  const [businessType, setBusinessType] = useState(profile.business_type || '');
  const [foodHygieneRating, setFoodHygieneRating] = useState(profile.food_hygiene_rating?.toString() || '');
  const [vehicleType, setVehicleType] = useState(profile.vehicle_type || '');
  const [licensePlate, setLicensePlate] = useState(profile.license_plate || '');

  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    const updates: Record<string, string | null> = {
      name,
      phone: phone || null,
      location: location || null,
    };
    if (role === 'donor') {
      updates.business_type = businessType || null;
      (updates as Record<string, string | number | null>).food_hygiene_rating = foodHygieneRating ? parseInt(foodHygieneRating) : null;
    }
    if (role === 'driver') {
      updates.vehicle_type = vehicleType || null;
      updates.license_plate = licensePlate || null;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id);
    setSaving(false);
    if (error) return;
    setSaved(true);
    setEditing(false);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setName(profile.name);
    setPhone(profile.phone || '');
    setLocation(profile.location || '');
    setBusinessType(profile.business_type || '');
    setFoodHygieneRating(profile.food_hygiene_rating?.toString() || '');
    setVehicleType(profile.vehicle_type || '');
    setLicensePlate(profile.license_plate || '');
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="rounded-2xl border border-border bg-white p-4 lg:p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Account Details</h2>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 animate-[fadeUp_0.3s_ease-out_both]">
                <Check className="h-3.5 w-3.5" />
                Saved!
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditing(true)}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
              <Mail className={`h-4 w-4 ${accentText}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
              <Phone className={`h-4 w-4 ${accentText}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
              <MapPin className={`h-4 w-4 ${accentText}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{location || 'Not provided'}</p>
            </div>
          </div>
          {role === 'donor' && (
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
                <Building2 className={`h-4 w-4 ${accentText}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Business Type</p>
                <p className="text-sm font-medium text-foreground">{businessType || 'Not provided'}</p>
              </div>
            </div>
          )}
          {role === 'donor' && (
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
                <ShieldCheck className={`h-4 w-4 ${accentText}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Food Hygiene Rating</p>
                <p className="text-sm font-medium text-foreground">{foodHygieneRating ? `${foodHygieneRating} / 5` : 'Not provided'}</p>
              </div>
            </div>
          )}
          {role === 'driver' && (
            <>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
                  <Car className={`h-4 w-4 ${accentText}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle Type</p>
                  <p className="text-sm font-medium text-foreground">{vehicleType || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentBg}`}>
                  <CreditCard className={`h-4 w-4 ${accentText}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">License Plate</p>
                  <p className="text-sm font-medium text-foreground">{licensePlate || 'Not provided'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 lg:p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Edit Profile</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-xl bg-cream/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            value={profile.email}
            disabled
            className="h-10 rounded-xl bg-secondary/50 text-muted-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-phone">Phone</Label>
          <Input
            id="edit-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +44 7700 900000"
            className="h-10 rounded-xl bg-cream/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-location">Location</Label>
          <Input
            id="edit-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bath, UK"
            className="h-10 rounded-xl bg-cream/50"
          />
        </div>
        {role === 'donor' && (
          <div className="space-y-2">
            <Label htmlFor="edit-business">Business Type</Label>
            <Input
              id="edit-business"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Restaurant, Cafe"
              className="h-10 rounded-xl bg-cream/50"
            />
          </div>
        )}
        {role === 'donor' && (
          <div className="space-y-2">
            <Label htmlFor="edit-hygiene">Food Hygiene Rating</Label>
            <select
              id="edit-hygiene"
              value={foodHygieneRating}
              onChange={(e) => setFoodHygieneRating(e.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-cream/50 px-3 text-sm"
            >
              <option value="">Not provided</option>
              <option value="5">5 — Very Good</option>
              <option value="4">4 — Good</option>
              <option value="3">3 — Generally Satisfactory</option>
              <option value="2">2 — Improvement Necessary</option>
              <option value="1">1 — Major Improvement Necessary</option>
            </select>
          </div>
        )}
        {role === 'driver' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="edit-vehicle">Vehicle Type</Label>
              <Input
                id="edit-vehicle"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="e.g. Van, Car"
                className="h-10 rounded-xl bg-cream/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-license">License Plate</Label>
              <Input
                id="edit-license"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="e.g. AB12 CDE"
                className="h-10 rounded-xl bg-cream/50"
              />
            </div>
          </>
        )}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 h-10 rounded-xl bg-brand-green text-sm font-semibold shadow-sm hover:bg-brand-green/90"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-10 rounded-xl border-border text-sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
