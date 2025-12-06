'use client';

import { Card } from '../atoms/Card';

interface PostCardSkeletonProps {
  style?: React.CSSProperties;
}

/**
 * Skeleton loading placeholder for PostCard
 */
export function PostCardSkeleton({ style }: PostCardSkeletonProps) {
  return (
    <Card padding="medium" style={style}>
      <div style={{ display: 'flex', gap: 'var(--size-3)' }}>
        {/* Avatar skeleton */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--surface-3)',
            flexShrink: 0,
            animation: 'var(--animation-blink)',
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header skeleton */}
          <div style={{ marginBottom: 'var(--size-3)' }}>
            {/* Display name */}
            <div
              style={{
                width: '40%',
                height: '20px',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                marginBottom: 'var(--size-1)',
                animation: 'var(--animation-blink)',
              }}
            />
            {/* Username */}
            <div
              style={{
                width: '30%',
                height: '16px',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                animation: 'var(--animation-blink)',
              }}
            />
          </div>

          {/* Content skeleton */}
          <div style={{ marginBottom: 'var(--size-3)' }}>
            <div
              style={{
                width: '100%',
                height: '16px',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                marginBottom: 'var(--size-2)',
                animation: 'var(--animation-blink)',
              }}
            />
            <div
              style={{
                width: '90%',
                height: '16px',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                marginBottom: 'var(--size-2)',
                animation: 'var(--animation-blink)',
              }}
            />
            <div
              style={{
                width: '70%',
                height: '16px',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                animation: 'var(--animation-blink)',
              }}
            />
          </div>

          {/* Action bar skeleton */}
          <div style={{ display: 'flex', gap: 'var(--size-4)', marginTop: 'var(--size-3)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: '32px',
                  height: '24px',
                  background: 'var(--surface-3)',
                  borderRadius: 'var(--radius-1)',
                  animation: 'var(--animation-blink)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Multiple skeleton cards for initial loading
 */
export function PostCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} style={{ marginBottom: 'var(--size-3)' }} />
      ))}
    </>
  );
}
