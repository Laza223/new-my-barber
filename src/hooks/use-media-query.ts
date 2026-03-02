'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para media queries reactivas.
 *
 * Uso:
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * Retorna false durante SSR para evitar hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
