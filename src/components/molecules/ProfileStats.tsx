'use client';

import Link from 'next/link';

interface ProfileStatsProps {
    acct: string;
    followingCount: number;
    followersCount: number;
}

/**
 * Presentation component for profile follower/following stats.
 */
export function ProfileStats({
    acct,
    followingCount,
    followersCount,
}: ProfileStatsProps) {
    return (
        <div style={{
            display: 'flex',
            gap: 'var(--size-4)',
            fontSize: 'var(--font-size-1)',
            marginBottom: 'var(--size-4)',
        }}>
            <Link href={`/@${acct}/following`} style={{ textDecoration: 'none' }}>
                <strong style={{ color: 'var(--text-1)' }}>
                    {followingCount.toLocaleString()}
                </strong>{' '}
                <span style={{ color: 'var(--text-2)' }}>Following</span>
            </Link>
            <Link href={`/@${acct}/followers`} style={{ textDecoration: 'none' }}>
                <strong style={{ color: 'var(--text-1)' }}>
                    {followersCount.toLocaleString()}
                </strong>{' '}
                <span style={{ color: 'var(--text-2)' }}>Followers</span>
            </Link>
        </div>
    );
}
