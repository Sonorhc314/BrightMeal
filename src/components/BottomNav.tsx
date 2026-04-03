'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import {
  Home,
  HandHeart,
  Truck,
  Clock,
  User,
  Bell,
  Trophy,
} from 'lucide-react';
import { NotificationBadge } from '@/components/NotificationBadge';
import type { UserRole } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: Record<UserRole, NavItem[]> = {
  donor: [
    { label: 'Home', href: '/home', icon: <Home className="h-5 w-5" /> },
    { label: 'Rank', href: '/leaderboard', icon: <Trophy className="h-5 w-5" /> },
    { label: 'History', href: '/history', icon: <Clock className="h-5 w-5" /> },
    { label: 'Alerts', href: '/notifications', icon: <Bell className="h-5 w-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  ],
  charity: [
    { label: 'Offers', href: '/offers', icon: <HandHeart className="h-5 w-5" /> },
    { label: 'Rank', href: '/leaderboard', icon: <Trophy className="h-5 w-5" /> },
    { label: 'History', href: '/history', icon: <Clock className="h-5 w-5" /> },
    { label: 'Alerts', href: '/notifications', icon: <Bell className="h-5 w-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  ],
  driver: [
    { label: 'Jobs', href: '/jobs', icon: <Truck className="h-5 w-5" /> },
    { label: 'Rank', href: '/leaderboard', icon: <Trophy className="h-5 w-5" /> },
    { label: 'History', href: '/history', icon: <Clock className="h-5 w-5" /> },
    { label: 'Alerts', href: '/notifications', icon: <Bell className="h-5 w-5" /> },
    { label: 'Profile', href: '/profile', icon: <User className="h-5 w-5" /> },
  ],
};

const roleActiveColors: Record<UserRole, { text: string; bg: string; bar: string }> = {
  donor: { text: 'text-brand-green', bg: 'bg-brand-green/10', bar: 'bg-brand-green' },
  charity: { text: 'text-brand-purple', bg: 'bg-brand-purple/10', bar: 'bg-brand-purple' },
  driver: { text: 'text-brand-blue', bg: 'bg-brand-blue/10', bar: 'bg-brand-blue' },
};

function inferRoleFromPath(pathname: string): UserRole | null {
  if (pathname.startsWith('/home') || pathname.startsWith('/post') || pathname.startsWith('/donations')) return 'donor';
  if (pathname.startsWith('/offers')) return 'charity';
  if (pathname.startsWith('/jobs')) return 'driver';
  // Shared pages: /leaderboard, /profile, /history, /notifications → null (fetch from DB)
  return null;
}

export function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole | null>(() => inferRoleFromPath(pathname));

  useEffect(() => {
    if (role) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setRole(data.role as UserRole);
        });
    });
  }, [role]);

  if (!role) return null;

  const items = navItems[role];
  const colors = roleActiveColors[role];

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="fixed left-0 top-0 z-50 hidden h-dvh w-56 flex-col border-r border-border bg-white lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <Image src="/logo-mark.svg" alt="BrightMeal" width={36} height={36} className="h-9 w-9" />
          <span className="text-lg font-bold text-brand-olive">BrightMeal</span>
        </div>
        <div className="flex flex-1 flex-col gap-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isAlerts = item.href === '/notifications';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? `${colors.bg} ${colors.text}`
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full ${colors.bar}`} />
                )}
                <span className="relative">
                  {item.icon}
                  {isAlerts && <NotificationBadge />}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around py-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isAlerts = item.href === '/notifications';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? colors.text
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="relative">
                  {item.icon}
                  {isAlerts && <NotificationBadge />}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${colors.bar}`} />
                )}
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
