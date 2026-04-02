'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowLeft, Loader2, Building2, Heart, Truck } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';
import type { UserRole } from '@/lib/types';

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'donor';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'donor', label: 'Donor', icon: <Building2 className="h-4 w-4" /> },
    { value: 'charity', label: 'Charity', icon: <Heart className="h-4 w-4" /> },
    { value: 'driver', label: 'Driver', icon: <Truck className="h-4 w-4" /> },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        name,
        email,
        phone: phone || null,
        location: location || null,
        business_type: role === 'donor' ? businessType || null : null,
        vehicle_type: role === 'driver' ? vehicleType || null : null,
        license_plate: role === 'driver' ? licensePlate || null : null,
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      switch (role) {
        case 'donor':
          router.push('/home');
          break;
        case 'charity':
          router.push('/offers');
          break;
        case 'driver':
          router.push('/jobs');
          break;
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-4 lg:max-w-lg lg:py-8">
      {/* Back link */}
      <div className="mb-6 animate-[fadeUp_0.8s_ease-out_both]">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Logo — mobile only */}
      <div className="mb-8 flex flex-col items-center animate-[fadeUp_0.8s_ease-out_0.1s_both] lg:items-start">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green shadow-lg shadow-brand-green/20 lg:hidden">
          <Leaf className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Create account</h1>
        <p className="mt-1 text-muted-foreground lg:text-base">Join the BrightMeal community</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="flex flex-col gap-4 animate-[fadeUp_0.8s_ease-out_0.2s_both]">
        {/* Role Selector */}
        <div className="space-y-2">
          <Label>I am a</Label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                  role === r.value
                    ? 'border-brand-green bg-brand-green-light text-brand-green'
                    : 'border-border bg-white text-muted-foreground hover:border-brand-green/30'
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column fields on desktop */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{role === 'donor' ? 'Business name' : role === 'charity' ? 'Organisation name' : 'Full name'}</Label>
            <Input
              id="name"
              placeholder={role === 'donor' ? 'e.g. Sunrise Bakery' : role === 'charity' ? 'e.g. Bath Food Bank' : 'e.g. John Smith'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 rounded-xl bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl bg-white"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 7700 900000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl bg-white"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Bath, UK"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-xl bg-white"
            />
          </div>

          {/* Role-specific fields */}
          {role === 'donor' && (
            <div className="space-y-2">
              <Label htmlFor="businessType">Business type</Label>
              <Input
                id="businessType"
                placeholder="e.g. Restaurant & Catering"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="h-12 rounded-xl bg-white"
              />
            </div>
          )}

          {role === 'driver' && (
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle type</Label>
              <Input
                id="vehicleType"
                placeholder="e.g. Honda Civic"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="h-12 rounded-xl bg-white"
              />
            </div>
          )}
        </div>

        {role === 'driver' && (
          <div className="lg:w-1/2 lg:pr-2">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License plate</Label>
              <Input
                id="licensePlate"
                placeholder="e.g. AB12 CDE"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                className="h-12 rounded-xl bg-white"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 rounded-xl bg-brand-green text-base font-semibold shadow-md shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all lg:w-auto lg:px-12 lg:self-start"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create account'}
        </Button>

        <div className="py-4 text-center lg:text-left">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-green">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
