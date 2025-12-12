'use client';

import styled from '@emotion/styled';
import { useRef, useEffect, type CSSProperties, type ReactNode } from 'react';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ScrollToTopButton } from '@/components/atoms/ScrollToTopButton';

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

  /**
   * Optional sticky header element to render inside the scroll container
   * The header will collapse when user scrolls using CSS scroll-state queries
   * Header should contain: .header-title, .header-subtitle, .header-actions
   */
  header?: ReactNode;
}

// Global cache for scroll restoration
const scrollStateCache = new Map<string, {
  offset: number;
  measurements: VirtualItem[];
}>();

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
  header,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Scroll direction detection for scroll-to-top button
  const { showScrollTop, hideScrollTop } = useScrollDirection(parentRef);

  // Get saved scroll state if available
  const savedState = scrollRestorationKey
    ? scrollStateCache.get(scrollRestorationKey)
    : undefined;

  // Setup virtualizer with scroll restoration
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    lanes: 1,
    // Provide getItemKey to generate stable keys
    getItemKey: (index) => getItemKey(items[index], index),
    // Scroll restoration: restore initial offset and measurements
    initialOffset: savedState?.offset,
    initialMeasurementsCache: savedState?.measurements,
    // Save scroll state when scrolling stops
    onChange: (instance) => {
      if (scrollRestorationKey && !instance.isScrolling) {
        scrollStateCache.set(scrollRestorationKey, {
          offset: instance.scrollOffset || 0,
          measurements: instance.measurementsCache,
        });
      }
    },
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Handle scroll to top
  const handleScrollToTop = () => {
    virtualizer.scrollToIndex(0, { behavior: 'smooth' });
    hideScrollTop();
  };

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

  return (
    <Container
      ref={parentRef}
      className="virtualized-list-container"
      $height={height}
      style={style}
    >
      {/* Sticky header with scroll-state container query support */}
      {header && <StickyHeaderWrapper>{header}</StickyHeaderWrapper>}

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
                className='virtualized-list-item'
                $translateY={virtualItem.start}
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
const Container = styled.div<{ $height: string }>`
  height: ${props => props.$height};
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  contain: paint;
  position: relative;
`;

/**
 * Sticky header wrapper with CSS scroll-state container queries.
 * When the header becomes stuck at the top, it collapses to a compact form.
 * 
 * Expected header structure:
 * - .header-title: flex container with title and subtitle
 * - .header-title h1: main title
 * - .header-subtitle: subtitle text (will be hidden when stuck)
 * - .header-actions: action buttons container
 * - .header-actions .btn-text: button text (will be hidden when stuck)
 */
const StickyHeaderWrapper = styled.div`
  container-type: scroll-state;
  position: sticky;
  top: 0;
  z-index: 10;

  /* Direct child is the header content */
  > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--size-4);
    background: linear-gradient(to bottom, var(--surface-1) 60%, transparent);
    gap: var(--size-3);
    flex-wrap: wrap;
    transition: padding 0.3s ease, gap 0.3s ease;
  }

  .header-title {
    display: flex;
    flex-direction: column;
    gap: var(--size-1);
    transition: gap 0.3s ease, flex-direction 0.3s ease;

    h1 {
      font-size: var(--font-size-5);
      margin: 0;
      transition: font-size 0.3s ease;
    }
  }

  .header-subtitle {
    font-size: var(--font-size-0);
    color: var(--text-2);
    max-height: 2em;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.3s ease, max-height 0.3s ease, margin-top 0.3s ease;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--size-2);
    flex-shrink: 0;
  }

  /* When stuck at top, collapse the header */
  @container scroll-state(stuck: top) {
    > * {
      padding: var(--size-2) var(--size-4);
      gap: var(--size-2);
      justify-content: flex-end;
    }

    .header-title {
      display: none;
    }

    .header-subtitle {
      opacity: 0;
      max-height: 0;
      margin-top: 0;
      pointer-events: none;
    }

    .header-actions .btn-text {
      display: none;
    }
  }
`;

const VirtualContent = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
  width: 100%;
  position: relative;
`;

const VirtualItemWrapper = styled.div<{ $translateY: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(${props => props.$translateY}px);
  will-change: transform;
`;

const EndIndicator = styled.div`
  text-align: center;
  padding: var(--size-4);
  color: var(--text-2);
`;
