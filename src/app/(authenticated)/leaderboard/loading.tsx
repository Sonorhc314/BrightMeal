import { Skeleton } from '@/components/Skeleton';

export default function LeaderboardLoading() {
  return (
    <div className="px-5 pt-6 lg:px-8 lg:pt-10">
      {/* Header */}
      <div className="mb-6 lg:mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-8 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Rank card */}
      <Skeleton className="mb-6 h-24 w-full rounded-2xl" />

      {/* Impact stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Tab bar */}
      <Skeleton className="mb-4 h-10 w-full rounded-lg" />

      {/* List items */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
