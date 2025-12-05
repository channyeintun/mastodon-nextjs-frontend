'use client';

import { useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedListProps<T> {
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
   * Container height
   * @default 'calc(100vh - 140px)'
   */
  height?: string;

  /**
   * Container style
   */
  style?: CSSProperties;

  /**
   * Unique key for scroll restoration
   * If provided, scroll position will be saved and restored
   */
  scrollRestorationKey?: string;
}

/**
 * Reusable virtualized list component with infinite scroll and scroll restoration
 */
export function VirtualizedList<T>({
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
  height = 'calc(100vh - 140px)',
  style,
  scrollRestorationKey,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollPositionSaved = useRef(false);

  // Setup virtualizer
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    lanes: 1,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Remeasure when items change
  useEffect(() => {
    virtualizer.measure();
  }, [items.length, virtualizer]);

  // Infinite scroll - fetch next page when near bottom
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= items.length - loadMoreThreshold) {
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

  // Scroll restoration - save scroll position before unmount
  useEffect(() => {
    if (!scrollRestorationKey) return;

    const element = parentRef.current;
    if (!element) return;

    const saveScrollPosition = () => {
      const scrollTop = element.scrollTop;
      sessionStorage.setItem(
        `scroll-${scrollRestorationKey}`,
        scrollTop.toString()
      );
      scrollPositionSaved.current = true;
    };

    // Save scroll position on scroll (debounced)
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 150);
    };

    element.addEventListener('scroll', handleScroll);

    // Save on unmount
    return () => {
      element.removeEventListener('scroll', handleScroll);
      saveScrollPosition();
    };
  }, [scrollRestorationKey]);

  // Scroll restoration - restore scroll position on mount
  useEffect(() => {
    if (!scrollRestorationKey || scrollPositionSaved.current) return;

    const element = parentRef.current;
    if (!element) return;

    // Wait for items to be measured before restoring scroll
    const timeoutId = setTimeout(() => {
      const savedPosition = sessionStorage.getItem(
        `scroll-${scrollRestorationKey}`
      );

      if (savedPosition) {
        const scrollTop = parseInt(savedPosition, 10);
        element.scrollTop = scrollTop;
        scrollPositionSaved.current = true;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [scrollRestorationKey, items.length]);

  // Show empty state if no items
  if (items.length === 0 && emptyState) {
    return <div style={{ height, ...style }}>{emptyState}</div>;
  }

  return (
    <div
      ref={parentRef}
      style={{
        height,
        overflow: 'auto',
        ...style,
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) return null;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoadingMore && loadingIndicator}

      {/* End of list indicator */}
      {!hasMore && items.length > 0 && endIndicator && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--size-4)',
            color: 'var(--text-2)',
          }}
        >
          {endIndicator}
        </div>
      )}
    </div>
  );
}
