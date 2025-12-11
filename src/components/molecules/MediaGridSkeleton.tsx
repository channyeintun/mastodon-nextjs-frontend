import type { CSSProperties } from 'react';
import { ImageSkeleton } from '@/components/atoms';

interface MediaGridSkeletonProps {
  /** Number of skeleton items to display (default: 9) */
  count?: number;
  /** Number of columns (default: 3) */
  columns?: number;
  /** Additional inline styles for the grid container */
  style?: CSSProperties;
}

/**
 * MediaGridSkeleton - Loading skeleton for media grids
 *
 * Displays a grid of square image skeletons, commonly used in
 * profile media tabs or media galleries.
 *
 * @example
 * ```tsx
 * <MediaGridSkeleton />
 * <MediaGridSkeleton count={6} columns={2} />
 * <MediaGridSkeleton count={12} />
 * ```
 */
export const MediaGridSkeleton = ({
  count = 9,
  columns = 3,
  style,
}: MediaGridSkeletonProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--size-1)',
        padding: 'var(--size-2)',
        ...style,
      }}
    >
      {[...Array(count)].map((_, i) => (
        <ImageSkeleton key={i} aspectRatio="1" />
      ))}
    </div>
  );
};
