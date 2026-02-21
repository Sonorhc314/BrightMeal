'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowLeft, Loader2, Sprout, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          switch (profile.role) {
            case 'donor': router.push('/home'); break;
            case 'charity': router.push('/offers'); break;
            case 'driver': router.push('/jobs'); break;
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.06] blur-3xl animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-brand-purple/[0.04] blur-3xl animate-[drift_25s_ease-in-out_infinite_reverse]" />
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

        {/* Right side — Login form */}
        <div className="flex flex-1 flex-col px-6 pb-8 pt-4 lg:max-w-md lg:py-0">
          {/* Back link */}
          <div className="mb-8 animate-[fadeUp_0.8s_ease-out_both]">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>

          {/* Logo — mobile only */}
          <div className="mb-10 flex flex-col items-center animate-[fadeUp_0.8s_ease-out_0.1s_both] lg:items-start">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green shadow-lg shadow-brand-green/20 lg:hidden">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-muted-foreground lg:text-base">Log in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5 animate-[fadeUp_0.8s_ease-out_0.2s_both]">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-white"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 h-12 rounded-xl bg-brand-green text-base font-semibold shadow-md shadow-brand-green/20 hover:bg-brand-green/90 active:scale-[0.98] transition-all"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log in'}
            </Button>

            <div className="py-4 text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/" className="font-semibold text-brand-green">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
