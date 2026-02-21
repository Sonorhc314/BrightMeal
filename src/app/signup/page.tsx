'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowLeft, Loader2, Building2, Heart, Truck, Sprout, Users } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { Suspense } from 'react';

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
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.06] blur-3xl animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute -left-16 bottom-1/3 h-56 w-56 rounded-full bg-brand-purple/[0.04] blur-3xl animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Desktop: two-column layout. Mobile: single column */}
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col lg:flex-row lg:items-center lg:gap-16 lg:px-12">

        {/* Left side — Branding (desktop only) */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-start">
          <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.25rem] bg-brand-green shadow-lg shadow-brand-green/20 animate-[fadeUp_0.8s_ease-out_both]">
            <Sprout className="h-9 w-9 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-[2.75rem] font-bold tracking-[-0.02em] text-foreground animate-[fadeUp_0.8s_ease-out_0.1s_both]">
            BrightMeal
          </h1>
          <p className="mt-2 text-lg leading-relaxed text-warm-gray max-w-md animate-[fadeUp_0.8s_ease-out_0.2s_both]">
            Connecting restaurants, charities, and volunteer drivers to reduce food waste and feed communities.
          </p>
          <div className="mt-10 space-y-4 animate-[fadeUp_0.6s_ease-out_0.4s_both]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/10">
                <Leaf className="h-4 w-4 text-brand-green" />
              </div>
              <p className="text-sm text-warm-gray">Reduce food waste from local businesses</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple/10">
                <Users className="h-4 w-4 text-brand-purple" />
              </div>
              <p className="text-sm text-warm-gray">Real-time coordination between all parties</p>
            </div>
          </div>
        </div>

        {/* Right side — Signup form */}
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
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
