import type { CSSProperties } from 'react';

interface CircleSkeletonProps {
  /** Size of the circle skeleton (default: var(--size-7)) */
  size?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * CircleSkeleton - A circular skeleton loader
 *
 * Used for loading states of circular UI elements like icon buttons,
 * avatars, or other round components.
 *
 * @example
 * ```tsx
 * <CircleSkeleton size="var(--size-7)" />
 * <CircleSkeleton size="48px" />
 * ```
 */
export const CircleSkeleton = ({ size = 'var(--size-7)', style }: CircleSkeletonProps) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--surface-3)',
        animation: 'var(--animation-blink)',
        ...style,
      }}
      aria-label="Loading..."
      role="status"
    />
  );
};
