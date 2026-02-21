import { Skeleton } from '@/components/Skeleton';

export default function DonorHomeLoading() {
  return (
    <div className="px-5 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="mb-1 h-4 w-24" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <Skeleton className="mb-2 h-5 w-5" />
            <Skeleton className="mb-1 h-7 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Button */}
      <Skeleton className="mb-6 h-12 w-full rounded-xl" />

      {/* Section title */}
      <Skeleton className="mb-3 h-6 w-32" />

      {/* Cards */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="mb-3 h-6 w-48 rounded-lg" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
