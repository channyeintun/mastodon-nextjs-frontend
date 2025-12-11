import type { CSSProperties } from 'react';
import { Card, CircleSkeleton, TextSkeleton } from '@/components/atoms';

interface UserCardSkeletonProps {
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * UserCardSkeleton - Loading skeleton for UserCard component
 *
 * Displays a skeleton loader with avatar, name, handle, and action button placeholders.
 *
 * @example
 * ```tsx
 * <UserCardSkeleton />
 * <UserCardSkeleton style={{ marginBottom: 'var(--size-3)' }} />
 * ```
 */
export const UserCardSkeleton = ({ style }: UserCardSkeletonProps) => {
  return (
    <Card padding="medium" style={style}>
      <div style={{ display: 'flex', gap: 'var(--size-3)', alignItems: 'center' }}>
        <CircleSkeleton size="48px" />
        <div style={{ flex: 1 }}>
          <TextSkeleton
            width="40%"
            height="16px"
            style={{ marginBottom: 'var(--size-2)' }}
          />
          <TextSkeleton width="25%" height="14px" />
        </div>
        <TextSkeleton width="80px" height="32px" style={{ borderRadius: 'var(--radius-2)' }} />
      </div>
    </Card>
  );
};
