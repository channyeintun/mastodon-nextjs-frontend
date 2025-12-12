'use client';

import styled from '@emotion/styled';
import Link from 'next/link';

interface ProfileStatsProps {
    acct: string;
    postsCount: number;
    followingCount: number;
    followersCount: number;
}

/**
 * Presentation component for profile posts/follower/following stats.
 */
export function ProfileStats({
    acct,
    postsCount,
    followingCount,
    followersCount,
}: ProfileStatsProps) {
    return (
        <Container>
            <StatItem>
                <Count>
                    {postsCount.toLocaleString()}
                </Count>{' '}
                <Label>Posts</Label>
            </StatItem>
            <StatsLink href={`/@${acct}/following`}>
                <Count>
                    {followingCount.toLocaleString()}
                </Count>{' '}
                <Label>Following</Label>
            </StatsLink>
            <StatsLink href={`/@${acct}/followers`}>
                <Count>
                    {followersCount.toLocaleString()}
                </Count>{' '}
                <Label>Followers</Label>
            </StatsLink>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  gap: var(--size-4);
  font-size: var(--font-size-1);
  margin-bottom: var(--size-4);
  flex-wrap: wrap;

  @media (max-width: 400px) {
    gap: var(--size-3);
  }
`;

const StatItem = styled.span`
  text-decoration: none;
`;

const StatsLink = styled(Link)`
  text-decoration: none;
`;

const Count = styled.strong`
  color: var(--text-1);
`;

const Label = styled.span`
  color: var(--text-2);

  @media (max-width: 320px) {
    display: none;
  }
`;
