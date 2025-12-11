import type { CSSProperties } from 'react';
import { CircleSkeleton, TextSkeleton } from '@/components/atoms';

interface PageHeaderSkeletonProps {
  /** Size of the icon skeleton (default: 32) */
  iconSize?: number;
  /** Width of the title skeleton (default: 120) */
  titleWidth?: number;
  /** Width of the subtitle skeleton (default: 80) */
  subtitleWidth?: number;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Show border bottom (default: true) */
  showBorder?: boolean;
}

/**
 * PageHeaderSkeleton - Loading skeleton for page headers
 *
 * Displays a skeleton loader with icon and text placeholders,
 * commonly used in page headers with navigation icons and titles.
 *
 * @example
 * ```tsx
 * <PageHeaderSkeleton />
 * <PageHeaderSkeleton iconSize={40} titleWidth={150} />
 * <PageHeaderSkeleton showBorder={false} />
 * ```
 */
export const PageHeaderSkeleton = ({
  iconSize = 32,
  titleWidth = 120,
  subtitleWidth = 80,
  style,
  showBorder = true,
}: PageHeaderSkeletonProps) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--size-3)',
        padding: 'var(--size-4)',
        borderBottom: showBorder ? '1px solid var(--surface-3)' : 'none',
        ...style,
      }}
    >
      <CircleSkeleton size={`${iconSize}px`} />
      <div>
        <TextSkeleton width={titleWidth} height={20} style={{ marginBottom: 4 }} />
        <TextSkeleton width={subtitleWidth} height={14} />
      </div>
    </div>
  );
};
