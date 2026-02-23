import { Skeleton } from '@/components/Skeleton';

export default function HistoryLoading() {
  return (
    <div className="px-5 pt-6">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <Skeleton className="mb-1 h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
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
