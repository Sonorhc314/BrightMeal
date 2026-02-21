import { Skeleton } from '@/components/Skeleton';

export default function NotificationsLoading() {
  return (
    <div className="min-h-dvh bg-background pb-20 lg:pb-0 lg:pl-56">
      <div className="mx-auto max-w-4xl px-5 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="mb-1 h-8 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl p-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1">
                <Skeleton className="mb-1.5 h-4 w-40" />
                <Skeleton className="mb-1.5 h-3 w-56" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
