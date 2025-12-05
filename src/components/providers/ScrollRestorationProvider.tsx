'use client';

import { useEffect } from 'react';

/**
 * Disables browser's automatic scroll restoration to allow custom scroll restoration
 */
export function ScrollRestorationProvider() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}
