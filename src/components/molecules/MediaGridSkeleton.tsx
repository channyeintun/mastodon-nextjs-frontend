import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import { ImageSkeleton } from '@/components/atoms';

// Styled components
const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  gap: var(--size-1);
  padding: var(--size-2);
`;

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
    <Grid $columns={columns} style={style}>
      {[...Array(count)].map((_, i) => (
        <ImageSkeleton key={i} aspectRatio="1" />
      ))}
    </Grid>
  );
};
