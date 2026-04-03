import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream lg:flex">
      {/* Desktop: branded left panel */}
      <div className="hidden lg:flex lg:w-[38%] lg:flex-col lg:items-center lg:justify-center lg:relative lg:overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #604605 0%, #3d2c03 50%, #1B1402 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-center px-10 text-center">
          <Image src="/logo-mark.svg" alt="BrightMeal" width={120} height={120} className="mb-5 h-24 w-24 xl:h-28 xl:w-28" priority />
          <h2 className="text-2xl font-bold text-white xl:text-3xl">Bright<span className="text-brand-gold">Meal</span></h2>
          <p className="mt-2 text-xs font-medium tracking-wide text-white/50">Food Rescue & Community Support</p>
          <p className="mt-5 text-sm font-medium leading-relaxed text-brand-gold/70 italic">A brighter plate for everyone.</p>
        </div>
      </div>

      {/* Right side — form area */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-cream lg:bg-white">
        {/* Mobile background shapes */}
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gold/[0.10] blur-3xl" />
          <div className="absolute -left-16 bottom-1/4 h-56 w-56 rounded-full bg-brand-olive-green/[0.05] blur-3xl" />
        </div>
        <div className="pointer-events-none absolute inset-0 hidden opacity-[0.02] lg:block" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

        <div className="relative z-10 w-full max-w-md px-6 py-10 lg:max-w-lg lg:rounded-2xl lg:border lg:border-border/50 lg:bg-white lg:px-10 lg:py-10 lg:shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
