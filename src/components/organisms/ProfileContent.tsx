'use client';

import styled from '@emotion/styled';
import { Activity } from 'react';
import { useMemo } from 'react';
import { Pin } from 'lucide-react';
import { PostCard } from '@/components/organisms';
import { WindowVirtualizedList } from '@/components/organisms/WindowVirtualizedList';
import { PostCardSkeleton, PostCardSkeletonList, MediaGrid, MediaGridSkeleton } from '@/components/molecules';
import { Tabs, EmptyState } from '@/components/atoms';
import type { TabItem } from '@/components/atoms/Tabs';
import type { Status } from '@/types';

type ProfileTab = 'posts' | 'posts_replies' | 'media';

const profileTabs: TabItem<ProfileTab>[] = [
    { value: 'posts', label: 'Posts' },
    { value: 'posts_replies', label: 'Posts & replies' },
    { value: 'media', label: 'Media' },
];

/** Extended Status type with pinned flag */
interface StatusItem {
    status: Status;
    isPinned: boolean;
}

interface ProfileContentProps {
    /** Account handle for scroll restoration */
    acct: string;
    /** Currently active tab */
    activeTab: ProfileTab;
    /** Tab change handler */
    onTabChange: (tab: ProfileTab) => void;
    /** Pinned statuses */
    pinnedStatuses?: Status[];
    /** Account statuses */
    statuses: Status[];
    /** Loading state */
    isLoading: boolean;
    /** Fetch next page */
    fetchNextPage: () => void;
    /** Has more pages */
    hasNextPage: boolean;
    /** Is fetching next page */
    isFetchingNextPage: boolean;
}

/**
 * ProfileContent - Displays user's posts with tabs and infinite scroll
 */
export function ProfileContent({
    acct,
    activeTab,
    onTabChange,
    pinnedStatuses,
    statuses,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: ProfileContentProps) {
    // Combine pinned and regular statuses for virtualization
    const combinedItems = useMemo<StatusItem[]>(() => {
        const pinned: StatusItem[] = (pinnedStatuses || []).map(status => ({
            status,
            isPinned: true,
        }));
        const regular: StatusItem[] = statuses.map(status => ({
            status,
            isPinned: false,
        }));
        return [...pinned, ...regular];
    }, [pinnedStatuses, statuses]);

    return (
        <>
            <TabsContainer>
                <Tabs
                    tabs={profileTabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                />
            </TabsContainer>

            <ContentSection>
                {/* Posts Tab Content */}
                <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
                    <TabContent>
                        {isLoading && statuses.length === 0 ? (
                            <LoadingContainer>
                                <PostCardSkeletonList count={5} />
                            </LoadingContainer>
                        ) : (
                            <WindowVirtualizedList<StatusItem>
                                style={{ padding: 0 }}
                                items={combinedItems}
                                renderItem={(item, index) => {
                                    const isFirstPinned = item.isPinned && (index === 0 || !combinedItems[index - 1]?.isPinned);
                                    const isLastPinned = item.isPinned && (index === combinedItems.length - 1 || !combinedItems[index + 1]?.isPinned);

                                    return (
                                        <PinnedItemWrapper $isLastPinned={isLastPinned}>
                                            {isFirstPinned && (
                                                <PinnedBadge>
                                                    <Pin size={14} />
                                                    Pinned
                                                </PinnedBadge>
                                            )}
                                            <PostCard status={item.status} style={{ marginBottom: 'var(--size-3)' }} />
                                        </PinnedItemWrapper>
                                    );
                                }}
                                getItemKey={(item) => `${item.isPinned ? 'pinned-' : ''}${item.status.id}`}
                                estimateSize={300}
                                overscan={5}
                                onLoadMore={fetchNextPage}
                                isLoadingMore={isFetchingNextPage}
                                hasMore={hasNextPage}
                                loadMoreThreshold={1}
                                scrollRestorationKey={`account-${acct}-posts`}
                                loadingIndicator={<PostCardSkeleton style={{ marginBottom: 'var(--size-3)' }} />}
                                endIndicator="No more posts"
                                emptyState={<EmptyState title="No posts yet" />}
                            />
                        )}
                    </TabContent>
                </Activity>

                {/* Posts & Replies Tab Content */}
                <Activity mode={activeTab === 'posts_replies' ? 'visible' : 'hidden'}>
                    <TabContent>
                        {isLoading && statuses.length === 0 ? (
                            <LoadingContainer>
                                <PostCardSkeletonList count={5} />
                            </LoadingContainer>
                        ) : (
                            <WindowVirtualizedList<StatusItem>
                                style={{ padding: 0 }}
                                items={combinedItems}
                                renderItem={(item, index) => {
                                    const isFirstPinned = item.isPinned && (index === 0 || !combinedItems[index - 1]?.isPinned);
                                    const isLastPinned = item.isPinned && (index === combinedItems.length - 1 || !combinedItems[index + 1]?.isPinned);

                                    return (
                                        <PinnedItemWrapper $isLastPinned={isLastPinned}>
                                            {isFirstPinned && (
                                                <PinnedBadge>
                                                    <Pin size={14} />
                                                    Pinned
                                                </PinnedBadge>
                                            )}
                                            <PostCard status={item.status} style={{ marginBottom: 'var(--size-3)' }} />
                                        </PinnedItemWrapper>
                                    );
                                }}
                                getItemKey={(item) => `${item.isPinned ? 'pinned-' : ''}${item.status.id}`}
                                estimateSize={300}
                                overscan={5}
                                onLoadMore={fetchNextPage}
                                isLoadingMore={isFetchingNextPage}
                                hasMore={hasNextPage}
                                loadMoreThreshold={1}
                                scrollRestorationKey={`account-${acct}-posts_replies`}
                                loadingIndicator={<PostCardSkeleton style={{ marginBottom: 'var(--size-3)' }} />}
                                endIndicator="No more posts"
                                emptyState={<EmptyState title="No posts yet" />}
                            />
                        )}
                    </TabContent>
                </Activity>

                {/* Media Tab Content */}
                <Activity mode={activeTab === 'media' ? 'visible' : 'hidden'}>
                    <MediaTabContent>
                        {isLoading && statuses.length === 0 ? (
                            <MediaGridSkeleton />
                        ) : (
                            <>
                                <MediaGrid statuses={statuses} />
                                {hasNextPage && (
                                    <LoadMoreButton
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                    </LoadMoreButton>
                                )}
                            </>
                        )}
                    </MediaTabContent>
                </Activity>
            </ContentSection>
        </>
    );
}

// Styled components
const TabsContainer = styled.div`
  padding: 0;
`;

const PinnedItemWrapper = styled.div<{ $isLastPinned: boolean }>`
  ${({ $isLastPinned }) =>
        $isLastPinned &&
        `
      border-bottom: 1px solid var(--surface-3);
      padding-bottom: var(--size-4);
      margin-bottom: var(--size-4);
    `}
`;

const PinnedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--size-1);
  padding: var(--size-1) var(--size-2);
  margin-bottom: var(--size-2);
  margin-left: var(--size-4);
  background: var(--surface-2);
  border-radius: var(--radius-2);
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MediaTabContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const LoadMoreButton = styled.button<{ disabled?: boolean }>`
  margin: var(--size-4) auto;
  padding: var(--size-2) var(--size-4);
  background: var(--surface-2);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-2);
  color: var(--text-1);
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--surface-3);
  }
`;

const LoadingContainer = styled.div`
  flex: 1;
  overflow: auto;
`;
