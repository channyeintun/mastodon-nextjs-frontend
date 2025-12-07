'use client';

import Link from 'next/link';
import { Check, X, Ban, VolumeX } from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { EmojiText } from '@/components/atoms/EmojiText';
import { useFollowAccount, useUnfollowAccount, useAcceptFollowRequest, useRejectFollowRequest, useUnblockAccount, useUnmuteAccount } from '@/api/mutations';
import { useRelationships, useCurrentAccount } from '@/api/queries';
import type { Account } from '@/types/mastodon';

interface AccountCardProps {
    account: Account;
    showFollowButton?: boolean;
    showFollowRequestActions?: boolean;
    showUnblockButton?: boolean;
    showUnmuteButton?: boolean;
    style?: React.CSSProperties;
}

export function AccountCard({
    account,
    showFollowButton = true,
    showFollowRequestActions = false,
    showUnblockButton = false,
    showUnmuteButton = false,
    style,
}: AccountCardProps) {
    const { data: currentAccount } = useCurrentAccount();
    const { data: relationships } = useRelationships([account.id]);
    const relationship = relationships?.[0];

    const followMutation = useFollowAccount();
    const unfollowMutation = useUnfollowAccount();
    const acceptMutation = useAcceptFollowRequest();
    const rejectMutation = useRejectFollowRequest();
    const unblockMutation = useUnblockAccount();
    const unmuteMutation = useUnmuteAccount();

    const isOwnProfile = currentAccount?.id === account.id;
    const isFollowing = relationship?.following || false;
    const isLoading = followMutation.isPending || unfollowMutation.isPending;
    const isRequestLoading = acceptMutation.isPending || rejectMutation.isPending;
    const isUnblockLoading = unblockMutation.isPending;
    const isUnmuteLoading = unmuteMutation.isPending;

    const handleFollowToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFollowing) {
            unfollowMutation.mutate(account.id);
        } else {
            followMutation.mutate(account.id);
        }
    };

    const handleAccept = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        acceptMutation.mutate(account.id);
    };

    const handleReject = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        rejectMutation.mutate(account.id);
    };

    const handleUnblock = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        unblockMutation.mutate(account.id);
    };

    const handleUnmute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        unmuteMutation.mutate(account.id);
    };

    const renderActions = () => {
        if (showUnblockButton) {
            return (
                <Button
                    variant="secondary"
                    size="small"
                    onClick={handleUnblock}
                    disabled={isUnblockLoading}
                    isLoading={isUnblockLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-1)' }}
                >
                    <Ban size={16} />
                    Unblock
                </Button>
            );
        }

        if (showUnmuteButton) {
            return (
                <Button
                    variant="secondary"
                    size="small"
                    onClick={handleUnmute}
                    disabled={isUnmuteLoading}
                    isLoading={isUnmuteLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-1)' }}
                >
                    <VolumeX size={16} />
                    Unmute
                </Button>
            );
        }

        if (showFollowRequestActions) {
            return (
                <>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={handleAccept}
                        disabled={isRequestLoading}
                        isLoading={acceptMutation.isPending}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-1)' }}
                    >
                        <Check size={16} />
                        Accept
                    </Button>
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={handleReject}
                        disabled={isRequestLoading}
                        isLoading={rejectMutation.isPending}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-1)' }}
                    >
                        <X size={16} />
                        Reject
                    </Button>
                </>
            );
        }

        if (showFollowButton && !isOwnProfile) {
            return (
                <Button
                    variant={isFollowing ? 'secondary' : 'primary'}
                    size="small"
                    onClick={handleFollowToggle}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            );
        }

        return null;
    };

    return (
        <Link
            href={`/@${account.acct}`}
            className="account-card"
            style={style}
        >
            <Avatar
                src={account.avatar}
                alt={account.display_name || account.username}
                size="medium"
            />

            <div className="account-card-info">
                <div className="account-card-name">
                    <EmojiText
                        text={account.display_name || account.username}
                        emojis={account.emojis}
                    />
                    {account.bot && (
                        <span className="account-card-badge">BOT</span>
                    )}
                </div>
                <div className="account-card-handle">@{account.acct}</div>
            </div>

            <div className="account-card-actions">
                {renderActions()}
            </div>
        </Link>
    );
}

export function AccountCardSkeleton({ style }: { style?: React.CSSProperties }) {
    return (
        <div className="account-card" style={style}>
            <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
            <div className="account-card-info">
                <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 4 }} />
                <div className="skeleton" style={{ width: 80, height: 14 }} />
            </div>
            <div className="account-card-actions">
                <div className="skeleton" style={{ width: 72, height: 32, borderRadius: 'var(--radius-2)' }} />
            </div>
        </div>
    );
}

