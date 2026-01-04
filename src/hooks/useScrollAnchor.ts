'use client';

import { useRef, useLayoutEffect, useEffect, RefObject } from 'react';
import { SCROLL_ANCHOR_OFFSET } from '@/constants/layout';

export interface UseScrollAnchorOptions {
    /** Whether the target element is ready for initial scroll */
    isReady: boolean;
    /** Unique key to reset scroll state (e.g., statusId for route changes) */
    key?: string;
    /** Ref to the anchor element (optional, will create one if not provided) */
    anchorRef?: RefObject<HTMLDivElement | null>;
    /** Ref to the container of elements ABOVE the anchor (for Safari polyfill) */
    ancestorsRef?: RefObject<HTMLElement | null>;
    /** Additional dependencies to trigger polyfill initialization */
    deps?: unknown[];
}

/**
 * Ported from the local document-level scroll-anchoring library.
 * Scrolls the container and any scroll ancestors until the desired offset is reached.
 */
function cumulativeScrollBy(element: HTMLElement, x: number, y: number) {
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;

    function getScrollOffsets(el: any) {
        if (el.offsetParent) {
            return { top: el.scrollTop, left: el.scrollLeft };
        } else {
            return { top: win!.pageYOffset, left: win!.pageXOffset };
        }
    }

    function scrollBy(el: any, dx: number, dy: number) {
        if (dx === 0 && dy === 0) return [0, 0];
        const orig = getScrollOffsets(el);
        const top = orig.top + dy;
        const left = orig.left + dx;

        if (el === doc || el === win || el === doc.documentElement || el === doc.body) {
            win!.scrollTo(left, top);
        } else {
            el.scrollTop = top;
            el.scrollLeft = left;
        }

        const next = getScrollOffsets(el);
        return [next.left - orig.left, next.top - orig.top];
    }

    function overflowParent(el: HTMLElement): HTMLElement | undefined {
        let parent = el;
        if (!parent.offsetParent || parent === doc.body) return;

        while (parent !== doc.body) {
            if (parent.parentElement) {
                parent = parent.parentElement;
            } else {
                return;
            }
            const style = win!.getComputedStyle(parent);
            if (
                style.position === 'fixed' ||
                style.overflowY === 'auto' ||
                style.overflowX === 'auto' ||
                style.overflowY === 'scroll' ||
                style.overflowX === 'scroll'
            ) {
                break;
            }
        }
        return parent;
    }

    let container = overflowParent(element);
    let cumulativeX = 0;
    let cumulativeY = 0;

    while (container) {
        const scrolled = scrollBy(container, x - cumulativeX, y - cumulativeY);
        cumulativeX += scrolled[0];
        cumulativeY += scrolled[1];

        // Use fuzzy matching for subpixel differences
        if (Math.abs(cumulativeX - x) < 1 && Math.abs(cumulativeY - y) < 1) break;

        container = overflowParent(container);
    }
}

/**
 * Hook to scroll to an anchor element on initial load and on route changes.
 * 
 * Ported strategy from the project's scroll-anchoring library:
 * Instead of ResizeObserver on a container, we track the anchor's viewport 
 * position and restore it whenever mutations occur in the ancestor container.
 */
export function useScrollAnchor({ isReady, key, anchorRef: externalAnchorRef, ancestorsRef, deps = [] }: UseScrollAnchorOptions) {
    const internalAnchorRef = useRef<HTMLDivElement>(null);
    const anchorRef = externalAnchorRef || internalAnchorRef;

    const hasScrolledRef = useRef(false);
    const prevKeyRef = useRef(key);

    // Track the last known viewport position of the anchor
    const lastPosRef = useRef<{ top: number; left: number } | null>(null);
    // Guard to prevent baseline drift during automated adjustments
    const isAdjustingRef = useRef(false);
    // Track if the user is currently interacting with the page
    const isInteractingRef = useRef(false);

    // Sync lastPosRef with manual scrolls to avoid "fighting" the user
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleInteractionStart = () => { isInteractingRef.current = true; };
        const handleInteractionEnd = () => { isInteractingRef.current = false; };

        const handleScroll = () => {
            if (!hasScrolledRef.current || !anchorRef.current || isAdjustingRef.current) return;

            // Only update baseline if the user is actively scrolling/interacting
            // or if it's the very first time we capture a position.
            if (isInteractingRef.current || !lastPosRef.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                lastPosRef.current = { top: rect.top, left: rect.left };
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        window.addEventListener('wheel', handleInteractionStart, { passive: true });
        window.addEventListener('touchstart', handleInteractionStart, { passive: true });
        window.addEventListener('mousedown', handleInteractionStart, { passive: true });

        // Reset interaction on mouseup/touchend; wheel events don't have an 'end',
        // so we'll rely on the next mutation to reset if needed or just time it out.
        window.addEventListener('mouseup', handleInteractionEnd, { passive: true });
        window.addEventListener('touchend', handleInteractionEnd, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            window.removeEventListener('wheel', handleInteractionStart);
            window.removeEventListener('touchstart', handleInteractionStart);
            window.removeEventListener('mousedown', handleInteractionStart);
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [anchorRef]);

    // Reset scroll state when key changes
    useLayoutEffect(() => {
        if (key !== prevKeyRef.current) {
            hasScrolledRef.current = false;
            prevKeyRef.current = key;
            lastPosRef.current = null;
        }
    }, [key]);

    // Initial scroll to anchor
    useEffect(() => {
        if (isReady && !hasScrolledRef.current) {
            const anchor = anchorRef.current;
            if (anchor) {
                const scrollAndCapture = () => {
                    const rect = anchor.getBoundingClientRect();
                    // Use cumulativeScrollBy instead of window.scrollTo for robustness
                    cumulativeScrollBy(anchor, 0, rect.top - SCROLL_ANCHOR_OFFSET);
                    hasScrolledRef.current = true;

                    // Capture baseline position immediately after manual scroll
                    const finalRect = anchor.getBoundingClientRect();
                    lastPosRef.current = { top: finalRect.top, left: finalRect.left };
                };

                // Execute once, then double check in next frame for layout stability
                scrollAndCapture();
                const rafId = requestAnimationFrame(scrollAndCapture);
                return () => cancelAnimationFrame(rafId);
            }
        }
    }, [isReady, key, anchorRef]);

    // Safari Polyfill: Ported preservePosition logic using MutationObserver & ResizeObserver
    useEffect(() => {
        if (typeof window === 'undefined' || !ancestorsRef) return;
        // Skip if native is supported
        if (CSS.supports?.('overflow-anchor', 'auto')) return;

        const container = ancestorsRef.current;
        if (!container) return;

        const handleShift = () => {
            if (!hasScrolledRef.current || !anchorRef.current || !lastPosRef.current || isAdjustingRef.current) return;

            const node = anchorRef.current;
            const { top, left } = node.getBoundingClientRect();
            const dx = left - lastPosRef.current.left;
            const dy = top - lastPosRef.current.top;

            // Significant shift detected (> 0.5px)
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                isAdjustingRef.current = true;
                cumulativeScrollBy(node, dx, dy);

                // Allow some time for scroll events to settle before re-enabling sync
                requestAnimationFrame(() => {
                    isAdjustingRef.current = false;
                });
            }
        };

        // MutationObserver for DOM changes, ResizeObserver for image/layout changes
        const mObs = new MutationObserver(handleShift);
        const rObs = new ResizeObserver(handleShift);

        mObs.observe(container, { childList: true, subtree: true, characterData: true, attributes: true });
        rObs.observe(container);

        // Also observe the anchor itself for any internal layout changes
        const node = anchorRef.current;
        if (node) {
            rObs.observe(node);
        }

        return () => {
            mObs.disconnect();
            rObs.disconnect();
        };
    }, [ancestorsRef, key, ...deps]);

    return anchorRef;
}
