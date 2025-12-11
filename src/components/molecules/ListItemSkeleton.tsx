import styled from '@emotion/styled';
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
    <Container style={style}>
      <ImageSkeleton width={48} height={48} borderRadius="var(--radius-2)" />
      <InfoWrapper>
        <TitleSkeleton width={120} height={18} />
        <TextSkeleton width={80} height={14} />
      </InfoWrapper>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  align-items: center;
  padding: var(--size-4);
  border-bottom: 1px solid var(--surface-3);
  gap: var(--size-3);
`;

const InfoWrapper = styled.div`
  flex: 1;
`;

const TitleSkeleton = styled(TextSkeleton)`
  margin-bottom: var(--size-1);
`;

