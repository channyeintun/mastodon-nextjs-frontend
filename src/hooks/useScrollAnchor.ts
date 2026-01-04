'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';

interface UseScrollAnchorOptions {
    /** Whether the target element is ready for initial scroll */
    isReady: boolean;
    /** Number of items above the anchor that may change */
    itemsAboveCount: number;
}

/**
 * Hook to maintain scroll position of an anchor element when content above it changes.
 * 
 * This is useful for thread views where ancestors load after the main post,
 * ensuring the main post stays in the same visual position.
 * 
 * @returns ref to attach to the anchor element
 */
export function useScrollAnchor({ isReady, itemsAboveCount }: UseScrollAnchorOptions) {
    const anchorRef = useRef<HTMLDivElement>(null);
    const hasScrolledRef = useRef(false);
    const prevItemsAboveCountRef = useRef(0);

    // Track previous viewport position of anchor (for scroll compensation)
    const previousViewportTopRef = useRef<number | null>(null);

    // Store current viewport position before render (called synchronously before layout)
    useLayoutEffect(() => {
        const anchor = anchorRef.current;
        if (anchor && hasScrolledRef.current) {
            previousViewportTopRef.current = anchor.getBoundingClientRect().top;
        }
    });

    // Adjust scroll when items above the anchor change
    useLayoutEffect(() => {
        const anchor = anchorRef.current;
        if (!anchor) return;

        // Compensate scroll when items above changed (after initial scroll)
        if (
            hasScrolledRef.current &&
            previousViewportTopRef.current !== null &&
            itemsAboveCount !== prevItemsAboveCountRef.current
        ) {
            const currentViewportTop = anchor.getBoundingClientRect().top;
            const viewportDiff = currentViewportTop - previousViewportTopRef.current;

            // If the element moved in the viewport, compensate
            if (Math.abs(viewportDiff) > 1) {
                window.scrollBy(0, viewportDiff);
            }
        }

        prevItemsAboveCountRef.current = itemsAboveCount;
    }, [itemsAboveCount]);

    // Initial scroll to anchor when ready
    useEffect(() => {
        if (isReady && !hasScrolledRef.current) {
            const anchor = anchorRef.current;
            if (anchor) {
                // Use double requestAnimationFrame to ensure CSS is fully computed
                // First rAF: DOM is updated, second rAF: CSS is painted
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        anchor.scrollIntoView({ behavior: 'instant', block: 'start' });
                        hasScrolledRef.current = true;
                    });
                });
            }
        }
    }, [isReady]);

    return anchorRef;
}
