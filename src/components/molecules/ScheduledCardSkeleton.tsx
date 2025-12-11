'use client';

import styled from '@emotion/styled';
import { Card } from '../atoms/Card';

interface ScheduledCardSkeletonProps {
    style?: React.CSSProperties;
}

/**
 * Skeleton loading placeholder for ScheduledStatus cards
 */
export function ScheduledCardSkeleton({ style }: ScheduledCardSkeletonProps) {
    return (
        <Card padding="medium" style={style}>
            {/* Scheduled date header */}
            <DateHeader>
                {/* Clock icon placeholder */}
                <ClockIconSkeleton />
                {/* Date text placeholder */}
                <DateTextSkeleton />
            </DateHeader>

            {/* Content area */}
            <ContentArea>
                <ContentSkeleton />
            </ContentArea>

            {/* Action buttons */}
            <ActionsRow>
                <ActionButtonSkeleton $width={70} />
                <ActionButtonSkeleton $width={80} />
            </ActionsRow>
        </Card>
    );
}

/**
 * Multiple skeleton cards for initial loading
 */
export function ScheduledCardSkeletonList({ count = 5 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} padding="medium">
                    {/* Scheduled date header */}
                    <DateHeader>
                        <ClockIconSkeleton />
                        <DateTextSkeleton />
                    </DateHeader>

                    {/* Content area */}
                    <ContentArea>
                        <ContentSkeleton />
                    </ContentArea>

                    {/* Action buttons */}
                    <ActionsRow>
                        <ActionButtonSkeleton $width={70} />
                        <ActionButtonSkeleton $width={80} />
                    </ActionsRow>
                </SkeletonCard>
            ))}
        </>
    );
}

// Base skeleton styles
const skeletonBase = `
  background: var(--surface-3);
  animation: var(--animation-blink);
`;

// Styled components
const DateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--size-2);
  margin-bottom: var(--size-3);
  padding-bottom: var(--size-2);
  border-bottom: 1px solid var(--surface-3);
`;

const ClockIconSkeleton = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  ${skeletonBase}
  flex-shrink: 0;
`;

const DateTextSkeleton = styled.div`
  width: 60%;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const ContentArea = styled.div`
  margin-bottom: var(--size-3);
`;

const ContentSkeleton = styled.div`
  width: 80%;
  height: 16px;
  ${skeletonBase}
  border-radius: var(--radius-1);
`;

const ActionsRow = styled.div`
  display: flex;
  gap: var(--size-2);
  justify-content: flex-end;
`;

const ActionButtonSkeleton = styled.div<{ $width: number }>`
  width: ${props => props.$width}px;
  height: 32px;
  ${skeletonBase}
  border-radius: var(--radius-2);
`;

const SkeletonCard = styled(Card)`
  margin-bottom: var(--size-3);
`;
