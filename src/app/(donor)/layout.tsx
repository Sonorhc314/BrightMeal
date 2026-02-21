import { BottomNav } from '@/components/BottomNav';

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background pb-20 lg:pb-0 lg:pl-56">
      <div className="mx-auto max-w-4xl">
        {children}
      </div>
      <BottomNav role="donor" />
    </div>
  );
}
