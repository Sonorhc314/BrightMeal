import { Skeleton } from '@/components/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-dvh bg-background pb-20 lg:pb-0 lg:pl-56">
      <div className="mx-auto max-w-4xl px-5 pt-6">
        {/* Avatar & name */}
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="mb-1 h-6 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
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

        {/* Details section */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout button */}
        <Skeleton className="mt-6 h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
