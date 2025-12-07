'use client';

import Link from 'next/link';
import { ArrowLeft, VolumeX } from 'lucide-react';
import { useMutedAccounts } from '@/api/queries';
import { AccountCard, AccountCardSkeleton } from '@/components/molecules/AccountCard';
import { VirtualizedList } from '@/components/organisms/VirtualizedList';
import { IconButton } from '@/components/atoms/IconButton';
import { Spinner } from '@/components/atoms/Spinner';
import type { Account } from '@/types/mastodon';

export default function MutedAccountsPage() {
    const {
        data: mutedPages,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMutedAccounts();

    const mutedAccounts = mutedPages?.pages.flatMap((page) => page) ?? [];

    if (isLoading) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--size-3)',
                    padding: 'var(--size-4)',
                    borderBottom: '1px solid var(--surface-3)',
                }}>
                    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div>
                        <div className="skeleton" style={{ width: 150, height: 20, marginBottom: 4 }} />
                        <div className="skeleton" style={{ width: 100, height: 14 }} />
                    </div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <AccountCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--size-3)',
                padding: 'var(--size-4)',
                borderBottom: '1px solid var(--surface-3)',
                position: 'sticky',
                top: 0,
                background: 'var(--surface-1)',
                zIndex: 10,
            }}>
                <Link href="/settings">
                    <IconButton>
                        <ArrowLeft size={20} />
                    </IconButton>
                </Link>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-4)', marginBottom: 'var(--size-1)', display: 'flex', alignItems: 'center', gap: 'var(--size-2)' }}>
                        <VolumeX size={20} />
                        Muted Accounts
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-2)' }}>
                        {mutedAccounts.length} muted account{mutedAccounts.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Muted Accounts List */}
            <VirtualizedList
                items={mutedAccounts}
                renderItem={(account: Account) => (
                    <AccountCard
                        key={account.id}
                        account={account}
                        showFollowButton={false}
                        showUnmuteButton={true}
                    />
                )}
                getItemKey={(account) => account.id}
                estimateSize={72}
                overscan={3}
                onLoadMore={() => fetchNextPage()}
                isLoadingMore={isFetchingNextPage}
                hasMore={!!hasNextPage}
                height="calc(100vh - 120px)"
                loadingIndicator={
                    <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--size-4)' }}>
                        <Spinner />
                    </div>
                }
                emptyState={
                    <div style={{ display: 'grid', placeItems: 'center', padding: 'var(--size-8)', color: 'var(--text-2)' }}>
                        <VolumeX size={48} style={{ opacity: 0.3, marginBottom: 'var(--size-4)' }} />
                        <p>No muted accounts</p>
                        <p style={{ fontSize: 'var(--font-size-0)', marginTop: 'var(--size-2)' }}>
                            When you mute someone, their posts and notifications will be hidden from you.
                        </p>
                    </div>
                }
            />
        </div>
    );
}
