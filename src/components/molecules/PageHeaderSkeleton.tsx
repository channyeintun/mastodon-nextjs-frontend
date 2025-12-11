import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import { TextSkeleton } from '@/components/atoms';

// Styled components
const Container = styled.div<{ $showBorder: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: var(--size-4);
  border-bottom: ${props => props.$showBorder ? '1px solid var(--surface-3)' : 'none'};
`;

const BackButtonSkeleton = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-2);
  background: var(--surface-3);
  animation: var(--animation-blink);
  flex-shrink: 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-2);
  margin-bottom: var(--size-1);
`;

const IconSkeleton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: var(--radius-1);
  background: var(--surface-3);
  animation: var(--animation-blink);
`;

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
    <Container $showBorder={showBorder} style={style}>
      {/* Back button skeleton (rounded square like IconButton) */}
      <BackButtonSkeleton />
      <div>
        {/* Title with icon placeholder */}
        <TitleWrapper>
          <IconSkeleton />
          <TextSkeleton width={titleWidth} height={20} />
        </TitleWrapper>
        {/* Subtitle */}
        <TextSkeleton width={subtitleWidth} height={14} />
      </div>
    </Container>
  );
};
