'use client';

import { useEffect, useRef } from 'react';
import { useUnreadNotificationCount } from '@/api';

const DEFAULT_TITLE = 'Mastodon';

/**
 * Hook to update document title with notification count when tab is not visible.
 * Resets to original title when user returns to the tab.
 */
export function useDocumentTitleNotification() {
    const { data: unreadCount } = useUnreadNotificationCount();
    const originalTitleRef = useRef<string>(DEFAULT_TITLE);

    useEffect(() => {
        // Store the original title on mount
        originalTitleRef.current = document.title || DEFAULT_TITLE;
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            const count = unreadCount?.count ?? 0;

            if (document.hidden && count > 0) {
                // Tab is hidden and we have unread notifications
                const displayCount = count > 99 ? '99+' : count;
                document.title = `(${displayCount}) ${originalTitleRef.current}`;
            } else {
                // Tab is visible or no unread notifications - restore original title
                document.title = originalTitleRef.current;
            }
        };

        // Initial check in case the tab is already hidden when this effect runs
        handleVisibilityChange();

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Restore original title on cleanup
            document.title = originalTitleRef.current;
        };
    }, [unreadCount?.count]);
}
