'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function NotificationBadge() {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setCount(count || 0);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    fetchCount();

    // Subscribe to notification changes via Realtime
    const channel = supabase
      .channel('notification-badge')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
      }, () => {
        fetchCount();
      })
      .subscribe();

    // Listen for manual "mark all read" events from MarkAllReadButton
    const handleRead = () => setCount(0);
    window.addEventListener('notifications-read', handleRead);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('notifications-read', handleRead);
    };
  }, [fetchCount]);

  if (count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}
