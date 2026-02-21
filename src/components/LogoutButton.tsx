'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="h-12 w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">
      <LogOut className="mr-2 h-4 w-4" />
      Log Out
    </Button>
  );
}
