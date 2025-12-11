import type { CSSProperties } from 'react';

interface ImageSkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Aspect ratio (e.g., '16/9', '1', '4/3') */
  aspectRatio?: string;
  /** Border radius (default: var(--radius-2)) */
  borderRadius?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Additional CSS class names */
  className?: string;
}

/**
 * ImageSkeleton - A skeleton loader for images and media content
 *
 * Used for loading states of images, videos, or any media placeholders.
 * Supports aspect ratio for responsive layouts.
 *
 * @example
 * ```tsx
 * <ImageSkeleton aspectRatio="1" />
 * <ImageSkeleton width="100px" height="100px" />
 * <ImageSkeleton aspectRatio="16/9" borderRadius="var(--radius-3)" />
 * ```
 */
export const ImageSkeleton = ({
  width,
  height,
  aspectRatio,
  borderRadius = 'var(--radius-2)',
  style,
  className = '',
}: ImageSkeletonProps) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        aspectRatio,
        background: 'var(--surface-3)',
        borderRadius,
        animation: 'var(--animation-blink)',
        ...style,
      }}
      aria-label="Loading image..."
      role="status"
    />
  );
};
