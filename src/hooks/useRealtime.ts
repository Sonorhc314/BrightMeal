'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtime(
  table: string,
  filter: string | undefined,
  callback: (payload: Record<string, unknown>) => void
) {
  const supabase = createClient();

  useEffect(() => {
    const channelName = `${table}-${filter || 'all'}`;
    let channel = supabase.channel(channelName);

    if (filter) {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => callback(payload as unknown as Record<string, unknown>)
      );
    } else {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => callback(payload as unknown as Record<string, unknown>)
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);
}
