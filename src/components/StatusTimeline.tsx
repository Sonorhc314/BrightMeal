import { Check, Package, HandHeart, Truck, CheckCircle2, XCircle } from 'lucide-react';
import type { DonationEvent, DonationStatus } from '@/lib/types';

const statusSteps: { status: DonationStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'posted', label: 'Posted', icon: <Package className="h-4 w-4" /> },
  { status: 'accepted', label: 'Accepted by Charity', icon: <HandHeart className="h-4 w-4" /> },
  { status: 'driver_assigned', label: 'Driver Assigned', icon: <Truck className="h-4 w-4" /> },
  { status: 'picked_up', label: 'Picked Up', icon: <Package className="h-4 w-4" /> },
  { status: 'delivered', label: 'Delivered', icon: <CheckCircle2 className="h-4 w-4" /> },
];

interface StatusTimelineProps {
  currentStatus: DonationStatus;
  events: DonationEvent[];
}

export function StatusTimeline({ currentStatus, events }: StatusTimelineProps) {
  const isCancelled = currentStatus === 'cancelled';
  const cancelEvent = isCancelled ? events.find((e) => e.status === 'cancelled') : null;

  // For cancelled donations, find the last completed step before cancellation
  const lastCompletedStep = isCancelled
    ? (() => {
        const completedStatuses = events
          .filter((e) => e.status !== 'cancelled')
          .map((e) => e.status);
        let lastIdx = -1;
        statusSteps.forEach((step, idx) => {
          if (completedStatuses.includes(step.status)) lastIdx = idx;
        });
        return lastIdx;
      })()
    : statusSteps.findIndex((s) => s.status === currentStatus);

  const currentIndex = lastCompletedStep;

  return (
    <div className="space-y-0">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;
        const event = events.find((e) => e.status === step.status);
        const isLast = index === statusSteps.length - 1 && !isCancelled;

        return (
          <div key={step.status} className="flex gap-3">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? isCurrent
                      ? 'bg-brand-green text-white shadow-md shadow-brand-green/25'
                      : 'bg-brand-green/20 text-brand-green'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {/* Pulse animation on current step */}
                {isCurrent && currentStatus !== 'delivered' && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-green/20" />
                )}
                {isCompleted && !isCurrent ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="relative">{step.icon}</span>
                )}
              </div>
              {(!isLast || isCancelled) && (
                <div
                  className={`w-0.5 flex-1 transition-colors ${
                    index < currentIndex
                      ? 'bg-gradient-to-b from-brand-green/40 to-brand-green/20'
                      : isCancelled && index === currentIndex
                      ? 'bg-gradient-to-b from-brand-green/20 to-red-200'
                      : 'bg-secondary'
                  }`}
                  style={{ minHeight: '2rem' }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p
                className={`text-sm font-medium ${
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </p>
              {event && (
                <p className="text-xs text-muted-foreground">
                  {new Date(event.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {event.actor && ` · ${event.actor.name}`}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Cancelled step */}
      {isCancelled && (
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-md shadow-red-500/25">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="pb-6">
            <p className="text-sm font-medium text-red-600">Cancelled</p>
            {cancelEvent && (
              <p className="text-xs text-muted-foreground">
                {new Date(cancelEvent.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {cancelEvent.actor && ` · ${cancelEvent.actor.name}`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
