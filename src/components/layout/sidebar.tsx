/**
 * Sidebar — desktop navigation.
 */
'use client';

import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

interface SidebarProps {
  shopName: string;
  planId: string;
}

const NAV_ITEMS = [
  { href: '/inicio', label: 'Inicio', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/new-sale',
    label: 'Nueva venta',
    icon: PlusCircle,
    highlight: true,
  },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ shopName, planId }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        'bg-card/50 hidden flex-col border-r transition-all duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b p-4">
        {!collapsed && (
          <span className="font-display truncate text-lg font-bold">
            {shopName}
          </span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'hover:bg-muted rounded-md p-1 transition-colors',
            collapsed && 'mx-auto',
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/inicio'
              ? pathname === '/inicio' || pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary border-primary border-l-2'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                item.highlight && !isActive && 'text-primary',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Plan info */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="font-medium capitalize">{planId}</span>
          </div>
          {planId === 'free' && (
            <Link
              href="/settings"
              className="text-primary mt-1 block text-xs hover:underline"
            >
              Actualizar plan
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}
