'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is mobile (screen width < 768px).
 * Uses a safe default during SSR to prevent hydration mismatches.
 * @returns boolean - true if mobile, false if desktop/tablet
 */
export function useIsMobile() {
  // Default to false for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial value
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 767.98px)').matches);
    };

    checkIsMobile();

    // Setup listener
    const mediaQuery = window.matchMedia('(max-width: 767.98px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
