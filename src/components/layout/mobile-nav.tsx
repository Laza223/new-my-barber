/**
 * MobileNav — bottom tab bar.
 * 3 tabs: Inicio, Dashboard, Config.
 */
'use client';

import { cn } from '@/lib/utils';
import { Home, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Config', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card/95 fixed right-0 bottom-0 left-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/inicio'
              ? pathname === '/inicio' || pathname === '/'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex min-w-[64px] flex-col items-center gap-0.5 px-3 py-2',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
