import Link from 'next/link';
import {
  CheckCircle2,
  Truck,
  Package,
  Bell,
  HandHeart,
} from 'lucide-react';
import type { Notification, NotificationType } from '@/lib/types';

const iconConfig: Record<NotificationType, { icon: React.ReactNode; bg: string }> = {
  order_accepted: { icon: <HandHeart className="h-5 w-5 text-brand-green" />, bg: 'bg-brand-green-light' },
  driver_assigned: { icon: <Truck className="h-5 w-5 text-brand-purple" />, bg: 'bg-brand-purple-light' },
  delivery_complete: { icon: <CheckCircle2 className="h-5 w-5 text-green-600" />, bg: 'bg-green-100' },
  new_offer: { icon: <Package className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-100' },
  driver_en_route: { icon: <Truck className="h-5 w-5 text-orange-600" />, bg: 'bg-orange-100' },
  new_job: { icon: <Package className="h-5 w-5 text-brand-purple" />, bg: 'bg-brand-purple-light' },
  pickup_reminder: { icon: <Bell className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-100' },
};

export function NotificationItem({ notification }: { notification: Notification }) {
  const timeAgo = getTimeAgo(new Date(notification.created_at));
  const config = iconConfig[notification.type] || { icon: <Bell className="h-5 w-5" />, bg: 'bg-secondary' };

  return (
    <Link
      href={notification.donation_id ? `/donations/${notification.donation_id}` : '#'}
    >
      <div
        className={`relative flex gap-3 rounded-xl p-3 transition-all hover:bg-secondary/50 ${
          notification.read
            ? 'bg-transparent'
            : 'bg-brand-green-light/30'
        }`}
      >
        {/* Unread left border */}
        {!notification.read && (
          <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-green" />
        )}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm ${notification.read ? 'text-foreground' : 'font-semibold text-foreground'}`}>
            {notification.title}
          </p>
          <p className="text-xs text-muted-foreground">{notification.message}</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{timeAgo}</p>
        </div>
        {!notification.read && (
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-green" />
        )}
      </div>
    </Link>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
