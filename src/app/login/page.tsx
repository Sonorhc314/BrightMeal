'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ArrowLeft, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';

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
    <AuthLayout>
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
    </AuthLayout>
  );
}
