'use client';

import styled from '@emotion/styled';
import { useRef, useEffect, useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { useWindowVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { useWindowScrollDirection } from '@/hooks/useWindowScrollDirection';
import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton';

interface WindowVirtualizedListProps<T> {
    /**
     * Array of items to render
     */
    items: T[];

    /**
     * Function to render each item
     */
    renderItem: (item: T, index: number) => ReactNode;

    /**
     * Function to extract unique key from item
     */
    getItemKey: (item: T, index: number) => string | number;

    /**
     * Estimated size of each item in pixels
     * @default 300
     */
    estimateSize?: number;

    /**
     * Number of items to render outside visible area
     * @default 5
     */
    overscan?: number;

    /**
     * Callback when user scrolls near the end
     */
    onLoadMore?: () => void;

    /**
     * Whether more items are being loaded
     */
    isLoadingMore?: boolean;

    /**
     * Whether there are more items to load
     */
    hasMore?: boolean;

    /**
     * Number of items from end to trigger load more
     * @default 3
     */
    loadMoreThreshold?: number;

    /**
     * Loading indicator component
     */
    loadingIndicator?: ReactNode;

    /**
     * End of list indicator component
     */
    endIndicator?: ReactNode;

    /**
     * Empty state component
     */
    emptyState?: ReactNode;

    /**
     * Container style
     */
    style?: CSSProperties;

    /**
     * Unique key for scroll restoration
     * If provided, scroll position will be saved and restored
     */
    scrollRestorationKey?: string;

    /**
     * Additional class name for the container
     */
    className?: string;
}

// Global cache for scroll restoration
const scrollStateCache = new Map<string, {
    offset: number;
    measurements: VirtualItem[];
}>();

/**
 * Reusable window-based virtualized list component with infinite scroll
 * Uses useWindowVirtualizer to scroll with the browser window instead of a container
 * 
 * Pattern from TanStack Virtual GridVirtualizerDynamic example
 */
export function WindowVirtualizedList<T>({
    items,
    renderItem,
    getItemKey,
    estimateSize = 300,
    overscan = 5,
    onLoadMore,
    isLoadingMore = false,
    hasMore = false,
    loadMoreThreshold = 3,
    loadingIndicator,
    endIndicator,
    emptyState,
    style,
    scrollRestorationKey,
    className,
}: WindowVirtualizedListProps<T>) {
    const listRef = useRef<HTMLDivElement | null>(null);
    const parentOffsetRef = useRef(0);

    // Scroll direction detection for scroll-to-top button
    const { showScrollTop, hideScrollTop } = useWindowScrollDirection();

    // Get saved scroll state if available
    const savedState = scrollRestorationKey
        ? scrollStateCache.get(scrollRestorationKey)
        : undefined;

    // Setup window virtualizer (pattern from TanStack GridVirtualizerDynamic)
    const virtualizer = useWindowVirtualizer({
        count: items.length,
        estimateSize: () => estimateSize,
        overscan,
        scrollMargin: parentOffsetRef.current,
        getItemKey: (index) => getItemKey(items[index], index),
        // Don't use initialOffset - we restore scroll imperatively after mount
        initialMeasurementsCache: savedState?.measurements,
        onChange: (instance) => {
            if (scrollRestorationKey && !instance.isScrolling) {
                scrollStateCache.set(scrollRestorationKey, {
                    offset: instance.scrollOffset || 0,
                    measurements: instance.measurementsCache,
                });
            }
        },
    });

    // Measure scrollMargin and restore scroll position before paint
    useLayoutEffect(() => {
        parentOffsetRef.current = listRef.current?.offsetTop ?? 0;

        // Restore scroll position if we have saved state
        if (savedState?.offset) {
            window.scrollTo({ top: savedState.offset, behavior: 'instant' });
        }
    }, []);

    const virtualItems = virtualizer.getVirtualItems();

    // Handle scroll to top
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hideScrollTop();
    };

    // Infinite scroll - fetch next page when near bottom
    // Use a ref to track if we've already triggered load more
    const loadMoreTriggeredRef = useRef(false);

    useEffect(() => {
        if (!onLoadMore || !hasMore || isLoadingMore) {
            loadMoreTriggeredRef.current = false;
            return;
        }

        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem) return;

        if (lastItem.index >= items.length - loadMoreThreshold && !loadMoreTriggeredRef.current) {
            loadMoreTriggeredRef.current = true;
            onLoadMore();
        }
    }, [
        hasMore,
        onLoadMore,
        items.length,
        isLoadingMore,
        virtualItems,
        loadMoreThreshold,
    ]);

    // Reset the trigger ref when isLoadingMore changes to false
    useEffect(() => {
        if (!isLoadingMore) {
            loadMoreTriggeredRef.current = false;
        }
    }, [isLoadingMore]);

    return (
        <Container
            ref={listRef}
            className={`window-virtualized-list${className ? ` ${className}` : ''}`}
            style={style}
        >
            {items.length === 0 && emptyState && emptyState}

            {items.length > 0 && (
                <VirtualContent $height={virtualizer.getTotalSize()}>
                    {virtualItems.map((virtualItem) => {
                        const item = items[virtualItem.index];
                        if (!item) return null;

                        return (
                            <VirtualItemWrapper
                                key={virtualItem.key}
                                data-index={virtualItem.index}
                                ref={virtualizer.measureElement}
                                className='window-virtualized-list-item'
                                style={{
                                    transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
                                }}
                            >
                                {renderItem(item, virtualItem.index)}
                            </VirtualItemWrapper>
                        );
                    })}
                </VirtualContent>
            )}

            {/* Loading indicator */}
            {isLoadingMore && loadingIndicator}

            {/* End of list indicator */}
            {!hasMore && items.length > 0 && endIndicator && (
                <EndIndicator>{endIndicator}</EndIndicator>
            )}

            {/* Scroll to top button */}
            <ScrollToTopButton visible={showScrollTop} onClick={handleScrollToTop} />
        </Container>
    );
}

// Styled components
const Container = styled.div`
  position: relative;
  width: 100%;
`;

const VirtualContent = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
  width: 100%;
  position: relative;
`;

const VirtualItemWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
`;

const EndIndicator = styled.div`
  text-align: center;
  padding: var(--size-4);
  color: var(--text-2);
`;
