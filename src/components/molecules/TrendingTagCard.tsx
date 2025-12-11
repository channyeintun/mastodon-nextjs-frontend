'use client'

import styled from '@emotion/styled';
import Link from 'next/link'
import { Hash, TrendingUp } from 'lucide-react'
import type { Tag } from '@/types/mastodon'

// Styled components for skeleton
const SkeletonIcon = styled.div`
    width: 40px;
    height: 40px;
`;

const SkeletonTitle = styled.div`
    width: 60%;
    height: 1.2em;
    border-radius: var(--radius-1);
`;

const SkeletonStats = styled.div`
    width: 40%;
    height: 0.9em;
    border-radius: var(--radius-1);
    margin-top: var(--size-2);
`;

interface TrendingTagCardProps {
    tag: Tag
    style?: React.CSSProperties
}

export function TrendingTagCard({ tag, style }: TrendingTagCardProps) {
    // Calculate usage stats from history
    const todayAccounts = tag.history?.[0] ? parseInt(tag.history[0].accounts, 10) : 0

    // Calculate weekly stats
    const weeklyUses = tag.history?.reduce((sum, day) => sum + parseInt(day.uses, 10), 0) ?? 0

    return (
        <Link
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="trending-tag-card"
            style={style}
        >
            <div className="trending-tag-icon">
                <Hash size={20} />
            </div>
            <div className="trending-tag-content">
                <div className="trending-tag-name">
                    #{tag.name}
                </div>
                <div className="trending-tag-stats">
                    {todayAccounts > 0 && (
                        <span className="trending-tag-stat">
                            {todayAccounts.toLocaleString()} {todayAccounts === 1 ? 'person' : 'people'} today
                        </span>
                    )}
                    {weeklyUses > 0 && (
                        <span className="trending-tag-stat">
                            <TrendingUp size={12} />
                            {weeklyUses.toLocaleString()} posts this week
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export function TrendingTagCardSkeleton({ style }: { style?: React.CSSProperties }) {
    return (
        <div className="trending-tag-card skeleton" style={style}>
            <SkeletonIcon className="trending-tag-icon skeleton-loading" />
            <div className="trending-tag-content">
                <SkeletonTitle className="skeleton-loading" />
                <SkeletonStats className="skeleton-loading" />
            </div>
        </div>
    )
}
