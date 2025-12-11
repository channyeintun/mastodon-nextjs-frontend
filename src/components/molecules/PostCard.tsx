'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/atoms';
import {
  StatusContent,
  LinkPreview,
  StatusEditHistory,
  DeletePostModal,
  ReblogIndicator,
  PostHeader,
  PostActions,
  PostPoll,
} from '@/components/molecules';
import type { Status } from '@/types';
import {
  useFavouriteStatus,
  useUnfavouriteStatus,
  useReblogStatus,
  useUnreblogStatus,
  useBookmarkStatus,
  useUnbookmarkStatus,
  useMuteConversation,
  useUnmuteConversation,
  usePinStatus,
  useUnpinStatus,
  useVotePoll,
  useCurrentAccount,
} from '@/api';
import { useAuthStore } from '@/hooks/useStores';
import { useGlobalModal } from '@/contexts/GlobalModalContext';
import { CSSProperties, useState } from 'react';

interface PostCardProps {
  status: Status;
  showThread?: boolean;
  style?: CSSProperties;
  hideActions?: boolean;
  showThreadLine?: boolean;
  showEditHistory?: boolean;
}

/**
 * Container component for displaying a Mastodon status/post.
 * Handles data fetching, mutations, and composes presentation components.
 */
export function PostCard({
  status,
  showThread = false,
  style,
  hideActions = false,
  showThreadLine = false,
  showEditHistory = false,
}: PostCardProps) {
  const router = useRouter();
  const authStore = useAuthStore();

  const [showCWContent, setShowCWContent] = useState(false);
  const [showCWMedia, setShowCWMedia] = useState(false);
  const [selectedPollChoices, setSelectedPollChoices] = useState<number[]>([]);

  const { data: currentAccount } = useCurrentAccount();
  const votePollMutation = useVotePoll();
  const favouriteMutation = useFavouriteStatus();
  const unfavouriteMutation = useUnfavouriteStatus();
  const reblogMutation = useReblogStatus();
  const unreblogMutation = useUnreblogStatus();
  const bookmarkMutation = useBookmarkStatus();
  const unbookmarkMutation = useUnbookmarkStatus();
  const muteConversationMutation = useMuteConversation();
  const unmuteConversationMutation = useUnmuteConversation();
  const pinStatusMutation = usePinStatus();
  const unpinStatusMutation = useUnpinStatus();
  const { openModal, closeModal } = useGlobalModal();

  // Handle reblog (boost) - show the original status
  const displayStatus = status.reblog || status;
  const isReblog = !!status.reblog;

  // Check if this is the current user's post
  const isOwnPost = currentAccount?.id === displayStatus.account.id;

  // Check if content warning is active (has actual text)
  const hasContentWarning = displayStatus.spoiler_text && displayStatus.spoiler_text.trim().length > 0;
  // Check if media should be blurred (sensitive flag OR content warning)
  const hasSensitiveMedia = displayStatus.sensitive || hasContentWarning;

  // --- Event Handlers ---

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayStatus.favourited) {
      unfavouriteMutation.mutate(displayStatus.id);
    } else {
      favouriteMutation.mutate(displayStatus.id);
    }
  };

  const handleReblog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.focus();
  };

  const confirmReblog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayStatus.reblogged) {
      unreblogMutation.mutate(displayStatus.id);
    } else {
      reblogMutation.mutate(displayStatus.id);
    }
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/compose?quoted_status_id=${displayStatus.id}`);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (displayStatus.bookmarked) {
      unbookmarkMutation.mutate(displayStatus.id);
    } else {
      bookmarkMutation.mutate(displayStatus.id);
    }
  };

  const handleMuteConversation = () => {
    if (displayStatus.muted) {
      unmuteConversationMutation.mutate(displayStatus.id);
    } else {
      muteConversationMutation.mutate(displayStatus.id);
    }
  };

  const handlePin = () => {
    if (displayStatus.pinned) {
      unpinStatusMutation.mutate(displayStatus.id);
    } else {
      pinStatusMutation.mutate(displayStatus.id);
    }
  };

  const handleEdit = () => {
    router.push(`/status/${displayStatus.id}/edit`);
  };

  const handleDelete = () => {
    openModal(
      <DeletePostModal
        postId={displayStatus.id}
        onClose={closeModal}
      />
    );
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: `Post by ${displayStatus.account.display_name || displayStatus.account.username}`,
      text: displayStatus.text || displayStatus.content.replace(/<[^>]*>/g, ''),
      url: displayStatus.url || `${window.location.origin}/status/${displayStatus.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('video')
    ) {
      return;
    }
    if (window.location.pathname === `/status/${displayStatus.id}`) {
      return;
    }
    router.push(`/status/${displayStatus.id}`);
  };

  const handlePollChoiceToggle = (index: number) => {
    if (!displayStatus.poll) return;
    if (displayStatus.poll.multiple) {
      setSelectedPollChoices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setSelectedPollChoices([index]);
    }
  };

  const handlePollVote = async () => {
    if (!displayStatus.poll || selectedPollChoices.length === 0) return;
    try {
      await votePollMutation.mutateAsync({
        pollId: displayStatus.poll.id,
        choices: selectedPollChoices,
      });
      setSelectedPollChoices([]);
    } catch (error) {
      console.error('Failed to vote on poll:', error);
    }
  };

  const handleReply = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.location.pathname !== `/status/${displayStatus.id}`) {
      router.push(`/status/${displayStatus.id}`);
    }
  };

  // Determine if poll voting is available
  const canVotePoll = displayStatus.poll
    ? authStore.isAuthenticated && !displayStatus.poll.expired && !displayStatus.poll.voted
    : false;

  return (
    <Card as="article" padding="medium" style={style} onClick={handleCardClick}>
      {/* Reblog indicator */}
      {isReblog && <ReblogIndicator account={status.account} />}

      {/* Post header and content */}
      <div style={{ marginBottom: 'var(--size-3)' }}>
        <PostHeader
          account={displayStatus.account}
          createdAt={displayStatus.created_at}
          visibility={displayStatus.visibility as 'public' | 'unlisted' | 'private' | 'direct'}
          statusId={displayStatus.id}
          isOwnPost={isOwnPost}
          pinned={displayStatus.pinned}
          muted={displayStatus.muted}
          onEdit={isOwnPost ? handleEdit : undefined}
          onDelete={isOwnPost ? handleDelete : undefined}
          onPin={isOwnPost && (displayStatus.visibility === 'public' || displayStatus.visibility === 'unlisted') ? handlePin : undefined}
          onMute={handleMuteConversation}
        />

        {/* Spoiler warning */}
        {hasContentWarning && (
          <div style={{
            marginTop: 'var(--size-2)',
            padding: 'var(--size-3)',
            background: 'var(--orange-2)',
            borderRadius: 'var(--radius-2)',
          }}>
            <div style={{
              fontSize: 'var(--font-size-1)',
              fontWeight: 'var(--font-weight-6)',
              color: 'var(--text-1)',
              marginBottom: 'var(--size-2)',
            }}>
              Content Warning: {displayStatus.spoiler_text}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowCWContent(!showCWContent);
              }}
              style={{
                padding: 'var(--size-2) var(--size-3)',
                background: 'var(--orange-6)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-2)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-1)',
                fontWeight: 'var(--font-weight-6)',
              }}
            >
              {showCWContent ? 'Hide content' : 'Show content'}
            </button>
          </div>
        )}

        {/* Post content */}
        {(!hasContentWarning || showCWContent) && displayStatus.content && !displayStatus.quote?.quoted_status && (
          <StatusContent
            html={displayStatus.content}
            emojis={displayStatus.emojis}
            style={{ marginTop: 'var(--size-3)' }}
          />
        )}

        {/* Media attachments */}
        {(!hasContentWarning || showCWContent) && displayStatus.media_attachments.length > 0 && (
          <div style={{ marginTop: 'var(--size-3)', position: 'relative' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: displayStatus.media_attachments.length === 1 ? '1fr' : 'repeat(2, 1fr)',
              gap: 'var(--size-2)',
              borderRadius: 'var(--radius-2)',
              overflow: 'hidden',
              filter: hasSensitiveMedia && !showCWMedia ? 'blur(32px)' : 'none',
              transition: 'filter 0.2s ease',
            }}>
              {displayStatus.media_attachments.map((media) => (
                <div
                  key={media.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    background: 'var(--surface-3)',
                  }}
                >
                  {media.type === 'image' && media.preview_url && (
                    <img
                      src={media.preview_url}
                      alt={media.description || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {media.type === 'video' && media.url && (
                    <video
                      src={media.url}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {media.type === 'gifv' && media.url && (
                    <video
                      src={media.url}
                      autoPlay
                      loop
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Sensitive content overlay */}
            {hasSensitiveMedia && !showCWMedia && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 'var(--radius-2)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowCWMedia(true);
                  }}
                  style={{
                    padding: 'var(--size-3) var(--size-4)',
                    background: 'var(--surface-2)',
                    border: '2px solid var(--surface-4)',
                    borderRadius: 'var(--radius-2)',
                    color: 'var(--text-1)',
                    fontSize: 'var(--font-size-1)',
                    fontWeight: 'var(--font-weight-6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--size-2)',
                    boxShadow: 'var(--shadow-3)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-3)';
                    e.currentTarget.style.borderColor = 'var(--blue-6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.borderColor = 'var(--surface-4)';
                  }}
                >
                  Click to view sensitive content
                </button>
              </div>
            )}
          </div>
        )}

        {/* Link preview */}
        {(!hasContentWarning || showCWContent) &&
          displayStatus.card &&
          displayStatus.media_attachments.length === 0 && (
            <LinkPreview
              card={displayStatus.card}
              style={{ marginTop: 'var(--size-3)' }}
            />
          )}

        {/* Quoted status */}
        {(!hasContentWarning || showCWContent) &&
          displayStatus.quote?.state === 'accepted' &&
          displayStatus.quote.quoted_status && (
            <div style={{ marginTop: 'var(--size-3)' }}>
              <PostCard
                status={displayStatus.quote.quoted_status}
                hideActions
              />
            </div>
          )}

        {/* Poll */}
        {(!hasContentWarning || showCWContent) && displayStatus.poll && (
          <PostPoll
            poll={displayStatus.poll}
            selectedChoices={selectedPollChoices}
            isVoting={votePollMutation.isPending}
            canVote={canVotePoll}
            onChoiceToggle={handlePollChoiceToggle}
            onVote={handlePollVote}
          />
        )}

        {/* Action bar */}
        {!hideActions && (
          <PostActions
            repliesCount={displayStatus.replies_count}
            reblogsCount={displayStatus.reblogs_count}
            favouritesCount={displayStatus.favourites_count}
            reblogged={displayStatus.reblogged}
            favourited={displayStatus.favourited}
            bookmarked={displayStatus.bookmarked}
            onReply={handleReply}
            onReblog={handleReblog}
            onConfirmReblog={confirmReblog}
            onQuote={handleQuote}
            onFavourite={handleFavourite}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        )}
      </div>

      {/* Edit History */}
      {showEditHistory && displayStatus.edited_at && (
        <StatusEditHistory
          statusId={displayStatus.id}
          editedAt={displayStatus.edited_at}
        />
      )}
    </Card>
  );
}
