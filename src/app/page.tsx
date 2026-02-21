import Link from "next/link";
import { Heart, Truck, Building2, ArrowRight, Sprout, Leaf, Users } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      {/* Organic background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-green/[0.06] blur-3xl animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-brand-purple/[0.04] blur-3xl animate-[drift_25s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-10 right-1/4 h-64 w-64 rounded-full bg-brand-green/[0.05] blur-3xl animate-[drift_18s_ease-in-out_infinite]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Desktop: two-column layout. Mobile: single column */}
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col lg:flex-row lg:items-center lg:gap-16 lg:px-12">

        {/* Left side - Brand & hero */}
        <div className="flex flex-col items-center px-7 pt-20 lg:flex-1 lg:items-start lg:pt-0">
          <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.25rem] bg-brand-green shadow-lg shadow-brand-green/20 animate-[fadeUp_0.8s_ease-out_both]">
            <Sprout className="h-9 w-9 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-[2rem] font-bold tracking-[-0.02em] text-foreground animate-[fadeUp_0.8s_ease-out_0.1s_both] lg:text-[2.75rem]">
            BrightMeal
          </h1>
          <p className="mt-2 text-center text-[0.95rem] leading-relaxed text-warm-gray animate-[fadeUp_0.8s_ease-out_0.2s_both] lg:text-left lg:text-lg lg:max-w-md">
            Connecting restaurants, charities, and volunteer drivers to reduce food waste and feed communities.
          </p>

          {/* Feature highlights - desktop only */}
          <div className="mt-10 hidden space-y-4 animate-[fadeUp_0.6s_ease-out_0.5s_both] lg:block">
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

        {/* Right side - Role selection cards */}
        <div className="flex flex-1 flex-col px-7 pb-10 pt-10 lg:max-w-md lg:pt-0">
          <p className="mb-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-warm-gray/60 animate-[fadeUp_0.8s_ease-out_0.3s_both] lg:text-left">
            Get started as
          </p>

          <div className="flex flex-col gap-3.5">
            <Link href="/signup?role=donor" className="animate-[fadeUp_0.6s_ease-out_0.35s_both]">
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-green/30 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/[0.08]">
                    <Building2 className="h-[1.35rem] w-[1.35rem] text-brand-green" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.95rem] font-semibold text-foreground">Food Donor</h3>
                    <p className="mt-0.5 text-[0.8rem] leading-snug text-warm-gray">
                      Share surplus from your restaurant or cafe
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream transition-colors duration-300 group-hover:bg-brand-green/10">
                    <ArrowRight className="h-4 w-4 text-warm-gray/50 transition-all duration-300 group-hover:text-brand-green group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/signup?role=charity" className="animate-[fadeUp_0.6s_ease-out_0.45s_both]">
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-purple/30 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/[0.08]">
                    <Heart className="h-[1.35rem] w-[1.35rem] text-brand-purple" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.95rem] font-semibold text-foreground">Charity</h3>
                    <p className="mt-0.5 text-[0.8rem] leading-snug text-warm-gray">
                      Collect food for those who need it most
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream transition-colors duration-300 group-hover:bg-brand-purple/10">
                    <ArrowRight className="h-4 w-4 text-warm-gray/50 transition-all duration-300 group-hover:text-brand-purple group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/signup?role=driver" className="animate-[fadeUp_0.6s_ease-out_0.55s_both]">
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-green/30 active:scale-[0.98]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/[0.08]">
                    <Truck className="h-[1.35rem] w-[1.35rem] text-emerald-600" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.95rem] font-semibold text-foreground">Volunteer Driver</h3>
                    <p className="mt-0.5 text-[0.8rem] leading-snug text-warm-gray">
                      Deliver surplus food to local charities
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream transition-colors duration-300 group-hover:bg-emerald-500/10">
                    <ArrowRight className="h-4 w-4 text-warm-gray/50 transition-all duration-300 group-hover:text-emerald-600 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Login link */}
          <div className="mt-8 text-center animate-[fadeUp_0.6s_ease-out_0.65s_both] lg:text-left">
            <p className="text-[0.85rem] text-warm-gray">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-green underline decoration-brand-green/30 underline-offset-[3px] transition-colors hover:decoration-brand-green/60"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
