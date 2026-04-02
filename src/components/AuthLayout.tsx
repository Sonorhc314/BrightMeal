import { Leaf, Sprout, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
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

        {/* Right side — Form content */}
        {children}
      </div>
    </div>
  );
}
