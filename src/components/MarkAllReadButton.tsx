'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCheck } from 'lucide-react';

export function MarkAllReadButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleMarkAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    router.refresh();
  };

  return (
    <button
      onClick={handleMarkAllRead}
      className="flex items-center gap-1.5 text-sm font-medium text-brand-green hover:underline"
    >
      <CheckCheck className="h-4 w-4" />
      Mark all read
    </button>
  );
}
