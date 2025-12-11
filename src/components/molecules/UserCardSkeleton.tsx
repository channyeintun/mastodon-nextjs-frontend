import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import { Card, CircleSkeleton, TextSkeleton } from '@/components/atoms';

// Styled components
const ContentWrapper = styled.div`
  display: flex;
  gap: var(--size-3);
  align-items: center;
`;

const InfoWrapper = styled.div`
  flex: 1;
`;

const NameSkeleton = styled(TextSkeleton)`
  margin-bottom: var(--size-2);
`;

const ButtonSkeleton = styled(TextSkeleton)`
  border-radius: var(--radius-2);
`;

interface UserCardSkeletonProps {
  /** Additional inline styles */
  style?: CSSProperties;
  /** Additional class name for styled-components */
  className?: string;
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
export const UserCardSkeleton = ({ style, className }: UserCardSkeletonProps) => {
  return (
    <Card padding="medium" style={style} className={className}>
      <ContentWrapper>
        <CircleSkeleton size="48px" />
        <InfoWrapper>
          <NameSkeleton width="40%" height="16px" />
          <TextSkeleton width="25%" height="14px" />
        </InfoWrapper>
        <ButtonSkeleton width="80px" height="32px" />
      </ContentWrapper>
    </Card>
  );
};
