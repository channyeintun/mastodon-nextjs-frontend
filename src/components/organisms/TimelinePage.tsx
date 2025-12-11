'use client';

import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useStores';
import { useInfiniteHomeTimeline, useCurrentAccount } from '@/api';
import { PostCard } from './PostCard';
import { PostCardSkeletonList, PostCardSkeleton, ProfilePillSkeleton } from '@/components/molecules';
import { VirtualizedList } from './VirtualizedList';
import { EmojiText, Button, CircleSkeleton, EmptyState } from '@/components/atoms';
import { Plus, Search } from 'lucide-react';
import { flattenAndUniqById } from '@/utils/fp';
import type { Status } from '@/types';

// Styled components
const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
`;

const Header = styled.div`
    background: var(--surface-1);
    z-index: 10;
    padding: var(--size-4);
    margin-bottom: var(--size-4);
    border-bottom: 1px solid var(--surface-3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
`;

const Title = styled.h1`
    font-size: var(--font-size-5);
    margin-bottom: var(--size-1);
`;

const Subtitle = styled.p`
    font-size: var(--font-size-0);
    color: var(--text-2);
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: var(--size-2);
`;

const SearchLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-7);
    height: var(--size-7);
    border-radius: 50%;
    color: var(--text-2);
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
`;

const ListContainer = styled.div`
    flex: 1;
    overflow: auto;
`;

const ErrorContainer = styled.div`
    text-align: center;
    margin-top: var(--size-8);
`;

const ErrorTitle = styled.h2`
    color: var(--red-6);
    margin-bottom: var(--size-3);
`;

const ErrorMessage = styled.p`
    color: var(--text-2);
    margin-bottom: var(--size-4);
`;

const EmptyContainer = styled.div`
    text-align: center;
    margin-top: var(--size-8);
`;

const EmptyTitle = styled.h2`
    margin-bottom: var(--size-3);
`;

const EmptyMessage = styled.p`
    color: var(--text-2);
    margin-bottom: var(--size-4);
`;

const VirtualListWrapper = styled(VirtualizedList)`
    flex: 1;
    min-height: 0;
` as typeof VirtualizedList;

const PostCardWrapper = styled(PostCard)`
    margin-bottom: var(--size-3);
`;

const PostCardSkeletonWrapper = styled(PostCardSkeleton)`
    margin-bottom: var(--size-3);
`;

export const TimelinePage = observer(() => {
    const authStore = useAuthStore();
    const { data: user } = useCurrentAccount();
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteHomeTimeline();

    // Flatten and deduplicate statuses using FP utility
    const uniqueStatuses = flattenAndUniqById(data?.pages);

    if (isLoading) {
        return (
            <Container className="full-height-container">
                {/* Header */}
                <Header>
                    <div>
                        <Title>Home</Title>
                        <Subtitle>
                            {authStore.instanceURL?.replace('https://', '')}
                        </Subtitle>
                    </div>
                    <HeaderActions>
                        <CircleSkeleton />
                        <ProfilePillSkeleton />
                    </HeaderActions>
                </Header>

                {/* Skeleton loading */}
                <ListContainer className="virtualized-list-container">
                    <PostCardSkeletonList count={5} />
                </ListContainer>
            </Container>
        );
    }

    if (isError) {
        return (
            <ErrorContainer>
                <ErrorTitle>Error Loading Timeline</ErrorTitle>
                <ErrorMessage>
                    {error instanceof Error ? error.message : 'An unknown error occurred'}
                </ErrorMessage>
                <Button onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </ErrorContainer>
        );
    }

    if (uniqueStatuses.length === 0) {
        return (
            <EmptyContainer>
                <EmptyTitle>Your Timeline is Empty</EmptyTitle>
                <EmptyMessage>
                    Follow some accounts to see their posts here!
                </EmptyMessage>
                <Link href="/compose">
                    <Button>
                        <Plus size={18} />
                        Create Your First Post
                    </Button>
                </Link>
            </EmptyContainer>
        );
    }

    return (
        <Container className="full-height-container">
            {/* Header */}
            <Header>
                <div>
                    <Title>Home</Title>
                    <Subtitle>
                        {authStore.instanceURL?.replace('https://', '')}
                    </Subtitle>
                </div>
                <HeaderActions>
                    <SearchLink href="/search">
                        <Search size={20} />
                    </SearchLink>
                    {user ? (
                        <Link href={`/@${user.acct}`} className="profile-pill profile-pill-static">
                            <img
                                src={user.avatar}
                                alt={user.display_name}
                                className="profile-pill-avatar"
                            />
                            <span className="profile-pill-name">
                                <EmojiText text={user.display_name} emojis={user.emojis} />
                            </span>
                        </Link>
                    ) : (
                        <ProfilePillSkeleton />
                    )}
                </HeaderActions>
            </Header>

            {/* Virtual scrolling container with scroll restoration */}
            <VirtualizedList<Status>
                items={uniqueStatuses}
                renderItem={(status) => (
                    <PostCardWrapper status={status} />
                )}
                getItemKey={(status) => status.id}
                estimateSize={300}
                overscan={5}
                onLoadMore={fetchNextPage}
                isLoadingMore={isFetchingNextPage}
                hasMore={hasNextPage}
                loadMoreThreshold={1}
                height="auto"
                style={{ flex: 1, minHeight: 0 }}
                scrollRestorationKey="home-timeline"
                loadingIndicator={<PostCardSkeletonWrapper />}
                endIndicator="You've reached the end of your timeline"
                emptyState={<EmptyState title="No posts yet" description="Follow some people to see their posts here." />}
            />
        </Container>
    );
});
