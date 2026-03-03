/**
 * DashboardHeader — top header.
 */
'use client';

import { getInitials } from '@/lib/utils';
import { LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import * as React from 'react';

interface DashboardHeaderProps {
  shopName: string;
  userName: string;
}

export function DashboardHeader({ shopName, userName }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      {/* Shop name (mobile) */}
      <div className="md:hidden">
        <h1 className="font-display max-w-[200px] truncate text-lg font-bold">
          {shopName}
        </h1>
      </div>

      {/* Spacer on desktop (sidebar has name) */}
      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hover:bg-muted rounded-md p-2 transition-colors"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
          >
            {getInitials(userName)}
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="bg-card absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border py-1 shadow-lg">
                <div className="border-b px-3 py-2">
                  <p className="truncate text-sm font-medium">{userName}</p>
                </div>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="hover:bg-muted flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <User className="h-4 w-4" />
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    // Sign out handled by auth
                    window.location.href = '/login';
                  }}
                  className="text-destructive hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
