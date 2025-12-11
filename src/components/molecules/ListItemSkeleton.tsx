import type { CSSProperties } from 'react';
import { ImageSkeleton, TextSkeleton } from '@/components/atoms';

interface ListItemSkeletonProps {
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * ListItemSkeleton - Loading skeleton for list items
 *
 * Displays a skeleton loader with icon, title, and subtitle placeholders.
 * Used in lists page and similar list-based interfaces.
 *
 * @example
 * ```tsx
 * <ListItemSkeleton />
 * {[...Array(3)].map((_, i) => <ListItemSkeleton key={i} />)}
 * ```
 */
export const ListItemSkeleton = ({ style }: ListItemSkeletonProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--size-4)',
        borderBottom: '1px solid var(--surface-3)',
        gap: 'var(--size-3)',
        ...style,
      }}
    >
      <ImageSkeleton width={48} height={48} borderRadius="var(--radius-2)" />
      <div style={{ flex: 1 }}>
        <TextSkeleton width={120} height={18} style={{ marginBottom: 'var(--size-1)' }} />
        <TextSkeleton width={80} height={14} />
      </div>
    </div>
  );
};
