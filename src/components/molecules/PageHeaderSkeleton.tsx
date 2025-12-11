import type { CSSProperties } from 'react';
import { TextSkeleton } from '@/components/atoms';

interface PageHeaderSkeletonProps {
  /** Width of the title skeleton (default: 150) */
  titleWidth?: number;
  /** Width of the subtitle skeleton (default: 100) */
  subtitleWidth?: number;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Show border bottom (default: true) */
  showBorder?: boolean;
}

/**
 * PageHeaderSkeleton - Loading skeleton for page headers
 *
 * Displays a skeleton loader matching the typical page header structure:
 * - Back button placeholder (rounded square)
 * - Title area with icon placeholder and text
 * - Subtitle text
 *
 * @example
 * ```tsx
 * <PageHeaderSkeleton />
 * <PageHeaderSkeleton titleWidth={180} subtitleWidth={120} />
 * <PageHeaderSkeleton showBorder={false} />
 * ```
 */
export const PageHeaderSkeleton = ({
  titleWidth = 150,
  subtitleWidth = 100,
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
      {/* Back button skeleton (rounded square like IconButton) */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-2)',
          background: 'var(--surface-3)',
          animation: 'var(--animation-blink)',
          flexShrink: 0,
        }}
      />
      <div>
        {/* Title with icon placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-2)', marginBottom: 'var(--size-1)' }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 'var(--radius-1)',
              background: 'var(--surface-3)',
              animation: 'var(--animation-blink)',
            }}
          />
          <TextSkeleton width={titleWidth} height={20} />
        </div>
        {/* Subtitle */}
        <TextSkeleton width={subtitleWidth} height={14} />
      </div>
    </div>
  );
};
