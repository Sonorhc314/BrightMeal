'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface RealtimeRefresherProps {
  table: string;
  filter?: string; // e.g. "donor_id=eq.abc123"
}

export function RealtimeRefresher({ table, filter }: RealtimeRefresherProps) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channelName = `realtime-${table}-${filter || 'all'}`;

    let pgChangesFilter: {
      event: '*';
      schema: 'public';
      table: string;
      filter?: string;
    } = {
      event: '*' as const,
      schema: 'public' as const,
      table,
    };

    if (filter) {
      pgChangesFilter = { ...pgChangesFilter, filter };
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', pgChangesFilter, () => {
        // Debounce: wait 300ms before refreshing
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          router.refresh();
        }, 300);
      })
      .subscribe();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      supabase.removeChannel(channel);
    };
  }, [table, filter, router]);

  return null;
}
