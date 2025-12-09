'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

/**
 * ThemeProvider - Applies theme globally and listens to system preference changes
 * 
 * This component:
 * - Applies initial theme from cookie on mount
 * - Listens to system preference changes when theme is auto (undefined cookie)
 * - Runs globally so auto mode works on all pages
 */
export function ThemeProvider() {
    useEffect(() => {
        const applyTheme = () => {
            const savedTheme = Cookies.get('theme') as 'light' | 'dark' | undefined;

            let activeTheme: 'light' | 'dark';

            if (savedTheme === 'light' || savedTheme === 'dark') {
                // Explicit choice
                activeTheme = savedTheme;
            } else {
                // Auto mode (undefined) - check system preference
                activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
            }

            document.documentElement.dataset.theme = activeTheme;
        };

        // Apply theme on mount
        applyTheme();

        // Listen to system preference changes for auto mode only
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleMediaChange = () => {
            // Only update if in auto mode (no cookie)
            if (!Cookies.get('theme')) {
                applyTheme();
            }
        };

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    return null; // This component doesn't render anything
}
