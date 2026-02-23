import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bell } from 'lucide-react';
import { NotificationItem } from '@/components/NotificationItem';
import { MarkAllReadButton } from '@/components/MarkAllReadButton';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';
import type { Notification, UserRole } from '@/lib/types';

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400_000);
  const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (notifDate.getTime() === today.getTime()) return 'Today';
  if (notifDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return 'Earlier';
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  const role = profile.role as UserRole;

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const unreadCount = (notifications || []).filter((n: Notification) => !n.read).length;

  const emptySubtext = role === 'donor'
    ? "You'll be notified about your donations here"
    : role === 'charity'
    ? 'Updates about your orders will appear here'
    : 'Updates about your deliveries will appear here';

  // Group notifications by date
  const grouped = new Map<string, Notification[]>();
  for (const n of (notifications || []) as Notification[]) {
    const group = getDateGroup(n.created_at);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(n);
  }

  return (
    <div className="px-5 pt-6 lg:px-8 lg:pt-10">
        <RealtimeRefresher table="notifications" filter={`user_id=eq.${user.id}`} />
        <div className="mb-6 lg:mb-8 flex items-center justify-between animate-[fadeUp_0.6s_ease-out_both]">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && <MarkAllReadButton />}
        </div>

        {notifications && notifications.length > 0 ? (
          <div className="space-y-4 lg:space-y-6 animate-[fadeUp_0.6s_ease-out_0.1s_both]">
            {Array.from(grouped.entries()).map(([group, items]) => (
              <div key={group}>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group}
                </p>
                <div className="space-y-1">
                  {items.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white/50 p-8 lg:p-12 text-center animate-[fadeUp_0.6s_ease-out_0.1s_both]">
            <Bell className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">No notifications yet</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{emptySubtext}</p>
          </div>
        )}
    </div>
  );
}
