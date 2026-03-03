/**
 * MobileNav — bottom tab bar.
 */
'use client';

import { cn } from '@/lib/utils';
import {
  ClipboardList,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/sales', label: 'Ventas', icon: ClipboardList },
  { href: '/new-sale', label: 'Venta', icon: Plus, special: true },
  { href: '/professionals', label: 'Equipo', icon: Users },
  { href: '/settings', label: 'Más', icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card/95 fixed right-0 bottom-0 left-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const isActive =
            tab.href === '/dashboard'
              ? pathname === '/dashboard' || pathname === '/'
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          if (tab.special) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="-mt-4 flex flex-col items-center"
              >
                <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
              </Link>
            );
          }

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
