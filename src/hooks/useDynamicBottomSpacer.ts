'use client';

import { useState, useLayoutEffect, useRef, RefObject } from 'react';

interface UseDynamicBottomSpacerOptions {
    /** Ref to the anchor element (e.g., main post) */
    anchorRef: RefObject<HTMLElement | null>;
    /** Dependencies that trigger recalculation */
    deps?: unknown[];
}

/**
 * Calculates dynamic bottom spacer height for scroll anchoring.
 * 
 * When content loads above the anchor element (e.g., ancestors in a thread),
 * the browser's native scroll anchoring needs scrollable space below to
 * adjust the scroll position. This hook calculates the minimum height needed
 * to allow the anchor to be positioned at the top of the viewport.
 * 
 * Formula: spacerHeight = viewportHeight - headerHeight - contentBelowAnchorHeight
 * 
 * @returns { headerRef, contentBelowRef, height }
 */
export function useDynamicBottomSpacer({ anchorRef, deps = [] }: UseDynamicBottomSpacerOptions) {
    const headerRef = useRef<HTMLDivElement>(null);
    const contentBelowRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        const calculate = () => {
            const anchor = anchorRef.current;
            const header = headerRef.current;
            const contentBelow = contentBelowRef.current;

            if (!anchor || !header) return;

            const viewportHeight = window.innerHeight;
            const headerHeight = header.getBoundingClientRect().height;
            const contentBelowHeight = contentBelow?.getBoundingClientRect().height ?? 0;

            // Ensure anchor can be scrolled to just below the header
            const requiredSpace = viewportHeight - headerHeight - contentBelowHeight;
            setHeight(Math.max(0, requiredSpace));
        };

        calculate();

        // Recalculate on resize
        window.addEventListener('resize', calculate);

        // Recalculate when content below changes size
        const resizeObserver = new ResizeObserver(calculate);
        if (contentBelowRef.current) {
            resizeObserver.observe(contentBelowRef.current);
        }

        return () => {
            window.removeEventListener('resize', calculate);
            resizeObserver.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorRef, ...deps]);

    return { headerRef, contentBelowRef, height };
}
