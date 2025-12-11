'use client';

import { use, useState, useMemo, Activity } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, Pin } from 'lucide-react';
import {
  useLookupAccount,
  useInfiniteAccountStatusesWithFilters,
  useRelationships,
  useCurrentAccount,
  usePinnedStatuses,
  useFollowAccount,
  useUnfollowAccount,
  useBlockAccount,
  useUnblockAccount,
  useMuteAccount,
  useUnmuteAccount,
} from '@/api';
import type { AccountStatusFilters } from '@/api/queries';
import {
  PostCardSkeletonList,
  PostCardSkeleton,
  AccountProfileSkeleton,
  MediaGrid,
  ProfileStats,
  ProfileBio,
  ProfileFields,
  ProfileActionButtons,
  HandleExplainer,
} from '@/components/molecules';
import { VirtualizedList, PostCard } from '@/components/organisms';
import { Avatar, Button, IconButton, EmojiText, Tabs } from '@/components/atoms';
import type { TabItem } from '@/components/atoms/Tabs';
import { flattenAndUniqById } from '@/utils/fp';
import type { Status } from '@/types';

type ProfileTab = 'posts' | 'posts_replies' | 'media';

const profileTabs: TabItem<ProfileTab>[] = [
  { value: 'posts', label: 'Posts' },
  { value: 'posts_replies', label: 'Posts & Replies' },
  { value: 'media', label: 'Media' },
];

export default function AccountPage({
  params,
}: {
  params: Promise<{ acct: string }>;
}) {
  const router = useRouter();
  const { acct: acctParam } = use(params);

  // Decode URL parameter (@ becomes %40 in URLs)
  const decodedAcct = decodeURIComponent(acctParam);

  // Check if acct starts with @, if not show 404
  if (!decodedAcct.startsWith('@')) {
    notFound();
  }

  // Remove @ prefix to get the acct handle
  const acct = decodedAcct.slice(1);

  // Lookup account by handle (acct)
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
  } = useLookupAccount(acct);

  const accountId = account?.id;

  // Tab state for profile content
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  // Compute filter params based on active tab
  const statusFilters: AccountStatusFilters = useMemo(() => {
    switch (activeTab) {
      case 'posts':
        return { exclude_replies: true };
      case 'posts_replies':
        return { exclude_replies: false, exclude_reblogs: true };
      case 'media':
        return { only_media: true };
      default:
        return { exclude_replies: true };
    }
  }, [activeTab]);

  const {
    data: statusPages,
    isLoading: statusesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAccountStatusesWithFilters(accountId || '', statusFilters);

  const { data: relationships } = useRelationships(accountId ? [accountId] : []);
  const relationship = relationships?.[0];

  const { data: pinnedStatuses } = usePinnedStatuses(accountId || '');
  const { data: currentAccount } = useCurrentAccount();
  const isOwnProfile = currentAccount?.id === accountId;

  const followMutation = useFollowAccount();
  const unfollowMutation = useUnfollowAccount();
  const blockMutation = useBlockAccount();
  const unblockMutation = useUnblockAccount();
  const muteMutation = useMuteAccount();
  const unmuteMutation = useUnmuteAccount();

  // Flatten and deduplicate statuses
  const uniqueStatuses = flattenAndUniqById(statusPages?.pages);

  // Event handlers
  const handleFollowToggle = () => {
    if (!accountId) return;
    if (relationship?.following) {
      unfollowMutation.mutate(accountId);
    } else {
      followMutation.mutate(accountId);
    }
  };

  const handleBlockToggle = () => {
    if (!accountId) return;
    if (relationship?.blocking) {
      unblockMutation.mutate(accountId);
    } else {
      blockMutation.mutate(accountId);
    }
  };

  const handleMuteToggle = () => {
    if (!accountId) return;
    if (relationship?.muting) {
      unmuteMutation.mutate(accountId);
    } else {
      muteMutation.mutate({ id: accountId });
    }
  };

  const isBlocking = relationship?.blocking || false;
  const isMuting = relationship?.muting || false;
  const isFollowing = relationship?.following || false;
  const isFollowLoading = followMutation.isPending || unfollowMutation.isPending;

  // Loading state
  if (accountLoading) {
    return (
      <div className="full-height-container" style={{ maxWidth: '600px', margin: '0 auto', padding: 0 }}>
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'var(--surface-1)',
          zIndex: 10,
          padding: 'var(--size-4)',
          marginBottom: 'var(--size-4)',
          borderBottom: '1px solid var(--surface-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--size-3)',
          flexShrink: 0,
        }}>
          <IconButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </IconButton>
          <div>
            <div style={{
              width: '150px',
              height: '24px',
              background: 'var(--surface-3)',
              borderRadius: 'var(--radius-1)',
              marginBottom: 'var(--size-1)',
              animation: 'var(--animation-blink)',
            }} />
            <div style={{
              width: '100px',
              height: '16px',
              background: 'var(--surface-3)',
              borderRadius: 'var(--radius-1)',
              animation: 'var(--animation-blink)',
            }} />
          </div>
        </div>
        <AccountProfileSkeleton />
        <div style={{
          borderTop: '1px solid var(--surface-3)',
          paddingTop: 'var(--size-4)',
          marginTop: 'var(--size-4)',
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-3)',
            fontWeight: 'var(--font-weight-6)',
            marginBottom: 'var(--size-4)',
            paddingLeft: 'var(--size-4)',
          }}>
            Posts
          </h3>
          <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
            <PostCardSkeletonList count={3} />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (accountError || !account) {
    return (
      <div style={{ textAlign: 'center', marginTop: 'var(--size-8)' }}>
        <h2 style={{ color: 'var(--red-6)', marginBottom: 'var(--size-3)' }}>
          Profile Not Found
        </h2>
        <p style={{ color: 'var(--text-2)', marginBottom: 'var(--size-4)' }}>
          This account could not be found or loaded.
        </p>
        <Link href="/">
          <Button>Back to Timeline</Button>
        </Link>
      </div>
    );
  }

  // Parse username and server from acct
  const parts = account.acct.split('@');
  const username = parts[0];
  const server = parts[1] || new URL(account.url).hostname;

  return (
    <div className="full-height-container" style={{ maxWidth: '600px', margin: '0 auto', padding: 0 }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface-1)',
        zIndex: 10,
        padding: 'var(--size-4)',
        marginBottom: 'var(--size-4)',
        borderBottom: '1px solid var(--surface-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--size-3)',
        flexShrink: 0,
      }}>
        <IconButton onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </IconButton>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-4)', marginBottom: 'var(--size-1)' }}>
            <EmojiText
              text={account.display_name || account.username}
              emojis={account.emojis}
            />
          </h1>
          <p style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-2)' }}>
            {account.statuses_count.toLocaleString()} posts
          </p>
        </div>
      </div>

      {/* Profile Header Image */}
      <div
        className="profile-header-image"
        style={{
          width: '100%',
          height: '200px',
          flexShrink: 0,
          background: account.header
            ? `url(${account.header}) center/cover`
            : 'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-2) 100%)',
          borderRadius: 'var(--radius-3)',
          marginBottom: 'calc(-1 * var(--size-8))',
        }}
      />

      {/* Profile Info */}
      <div style={{ padding: 'var(--size-4)', paddingTop: 'var(--size-2)' }}>
        {/* Avatar and action buttons row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--size-3)' }}>
          <Avatar
            src={account.avatar}
            alt={account.display_name || account.username}
            size="xlarge"
            style={{
              border: '4px solid var(--surface-1)',
              background: 'var(--surface-1)',
            }}
          />

          <ProfileActionButtons
            isOwnProfile={isOwnProfile}
            isBlocking={isBlocking}
            isMuting={isMuting}
            isFollowing={isFollowing}
            isLoading={isFollowLoading}
            isMutePending={muteMutation.isPending || unmuteMutation.isPending}
            isBlockPending={blockMutation.isPending || unblockMutation.isPending}
            acct={account.acct}
            onFollowToggle={handleFollowToggle}
            onMuteToggle={handleMuteToggle}
            onBlockToggle={handleBlockToggle}
          />
        </div>

        {/* Name section */}
        <div style={{ marginBottom: 'var(--size-3)' }}>
          <h2 style={{ fontSize: 'var(--font-size-4)', fontWeight: 'var(--font-weight-7)', marginBottom: 'var(--size-1)' }}>
            <EmojiText
              text={account.display_name || account.username}
              emojis={account.emojis}
            />
            {account.bot && (
              <span style={{
                marginLeft: 'var(--size-2)',
                fontSize: 'var(--font-size-0)',
                padding: '2px var(--size-2)',
                background: 'var(--surface-3)',
                borderRadius: 'var(--radius-1)',
                fontWeight: 'var(--font-weight-5)',
              }}>
                BOT
              </span>
            )}
            {account.locked && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'var(--size-2)', verticalAlign: 'middle', display: 'inline' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            )}
          </h2>
          <HandleExplainer username={username} server={server} />
        </div>

        {/* Bio */}
        <ProfileBio note={account.note} />

        {/* Fields (metadata) */}
        <ProfileFields fields={account.fields} />

        {/* Joined date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--size-2)',
          color: 'var(--text-2)',
          fontSize: 'var(--font-size-1)',
          marginBottom: 'var(--size-3)',
        }}>
          <Calendar size={16} />
          <span>
            Joined {new Date(account.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Stats */}
        <ProfileStats
          acct={account.acct}
          followingCount={account.following_count}
          followersCount={account.followers_count}
        />

        {/* External link */}
        {account.url && (
          <a
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--size-1)',
              color: 'var(--blue-6)',
              fontSize: 'var(--font-size-1)',
              textDecoration: 'none',
            }}
          >
            View on Mastodon <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Tabs Section */}
      <div style={{
        borderTop: '1px solid var(--surface-3)',
        marginTop: 'var(--size-4)',
      }}>
        <Tabs
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="underline"
          fullWidth
        />
      </div>

      {/* Pinned Posts Section */}
      {activeTab !== 'media' && pinnedStatuses && pinnedStatuses.length > 0 && (
        <div style={{
          paddingTop: 'var(--size-4)',
          paddingBottom: 'var(--size-4)',
          borderBottom: '1px solid var(--surface-3)',
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-2)',
            fontWeight: 'var(--font-weight-6)',
            marginBottom: 'var(--size-3)',
            paddingLeft: 'var(--size-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--size-2)',
            color: 'var(--text-2)',
          }}>
            <Pin size={16} />
            Pinned Posts
          </h3>
          {pinnedStatuses.map(status => (
            <PostCard
              key={status.id}
              status={status}
              style={{ marginBottom: 'var(--size-3)' }}
            />
          ))}
        </div>
      )}

      {/* Content Section */}
      <div style={{
        paddingTop: 'var(--size-4)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Posts Tab Content */}
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {statusesLoading && uniqueStatuses.length === 0 ? (
              <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
                <PostCardSkeletonList count={3} />
              </div>
            ) : (
              <VirtualizedList<Status>
                items={uniqueStatuses}
                renderItem={(status) => (
                  <PostCard
                    status={status}
                    style={{ marginBottom: 'var(--size-3)' }}
                  />
                )}
                getItemKey={(status) => status.id}
                estimateSize={300}
                overscan={5}
                onLoadMore={fetchNextPage}
                isLoadingMore={isFetchingNextPage}
                hasMore={hasNextPage}
                loadMoreThreshold={1}
                height="100dvh"
                scrollRestorationKey={`account-${acct}-posts`}
                loadingIndicator={<PostCardSkeleton style={{ marginBottom: 'var(--size-3)' }} />}
                endIndicator="No more posts"
                emptyState={
                  <div style={{ textAlign: 'center', padding: 'var(--size-8)', color: 'var(--text-2)' }}>
                    No posts yet
                  </div>
                }
              />
            )}
          </div>
        </Activity>

        {/* Posts & Replies Tab Content */}
        <Activity mode={activeTab === 'posts_replies' ? 'visible' : 'hidden'}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {statusesLoading && uniqueStatuses.length === 0 ? (
              <div className="virtualized-list-container" style={{ flex: 1, overflow: 'auto' }}>
                <PostCardSkeletonList count={3} />
              </div>
            ) : (
              <VirtualizedList<Status>
                items={uniqueStatuses}
                renderItem={(status) => (
                  <PostCard
                    status={status}
                    style={{ marginBottom: 'var(--size-3)' }}
                  />
                )}
                getItemKey={(status) => status.id}
                estimateSize={300}
                overscan={5}
                onLoadMore={fetchNextPage}
                isLoadingMore={isFetchingNextPage}
                hasMore={hasNextPage}
                loadMoreThreshold={1}
                height="100dvh"
                scrollRestorationKey={`account-${acct}-posts_replies`}
                loadingIndicator={<PostCardSkeleton style={{ marginBottom: 'var(--size-3)' }} />}
                endIndicator="No more posts"
                emptyState={
                  <div style={{ textAlign: 'center', padding: 'var(--size-8)', color: 'var(--text-2)' }}>
                    No posts yet
                  </div>
                }
              />
            )}
          </div>
        </Activity>

        {/* Media Tab Content */}
        <Activity mode={activeTab === 'media' ? 'visible' : 'hidden'}>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {statusesLoading && uniqueStatuses.length === 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--size-1)',
                padding: 'var(--size-2)'
              }}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      background: 'var(--surface-3)',
                      borderRadius: 'var(--radius-2)',
                      animation: 'var(--animation-blink)',
                    }}
                  />
                ))}
              </div>
            ) : (
              <>
                <MediaGrid statuses={uniqueStatuses} />
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    style={{
                      margin: 'var(--size-4) auto',
                      padding: 'var(--size-2) var(--size-4)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--surface-3)',
                      borderRadius: 'var(--radius-2)',
                      color: 'var(--text-1)',
                      cursor: 'pointer',
                    }}
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                  </button>
                )}
              </>
            )}
          </div>
        </Activity>
      </div>
    </div>
  );
}
