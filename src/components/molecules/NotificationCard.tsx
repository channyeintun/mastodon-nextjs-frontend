'use client';

import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Heart,
    Repeat2,
    MessageCircle,
    UserPlus,
    BarChart2,
    Edit2,
    Bell,
    X,
} from 'lucide-react';
import { Avatar, Card, EmojiText, IconButton } from '@/components/atoms';
import { StatusContent } from '@/components/molecules';
import type { Notification, NotificationType } from '@/types';
import { useDismissNotification } from '@/api';

// Styled components
const ContentWrapper = styled.div`
    display: flex;
    gap: var(--size-3);
`;

const IconColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-2);
`;

const IconCircle = styled.div<{ $color: string }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: color-mix(in srgb, ${props => props.$color} 20%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.$color};
`;

const ContentColumn = styled.div`
    flex: 1;
    min-width: 0;
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: var(--size-2);
    margin-bottom: var(--size-2);
`;

const AvatarLink = styled(Link)`
    flex-shrink: 0;
`;

const InfoWrapper = styled.div`
    flex: 1;
    min-width: 0;
`;

const MessageText = styled.div`
    font-size: var(--font-size-1);
    color: var(--text-1);
    line-height: 1.4;
`;

const AccountLink = styled(Link)`
    text-decoration: none;
    color: var(--text-1);
    font-weight: var(--font-weight-6);
`;

const ActionText = styled.span`
    color: var(--text-2);
`;

const TimeText = styled.div`
    font-size: var(--font-size-0);
    color: var(--text-3);
    margin-top: var(--size-1);
`;

const DismissButton = styled(IconButton)`
    opacity: 0.6;
`;

const StatusPreview = styled.div`
    padding: var(--size-2);
    background: var(--surface-2);
    border-radius: var(--radius-2);
    margin-top: var(--size-2);
`;

const PreviewContent = styled.div`
    font-size: var(--font-size-0);
    color: var(--text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const MentionContent = styled(StatusContent)`
    font-size: var(--font-size-1);
`;

const NewCard = styled(Card)`
    border-left: 3px solid var(--blue-6);
    background: color-mix(in srgb, var(--blue-6) 5%, var(--surface-2));
`;

interface NotificationCardProps {
    notification: Notification;
    onDismiss?: (id: string) => void;
    style?: React.CSSProperties;
    isNew?: boolean;
}

// Format relative time
function formatRelativeTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Notification type configuration
const NOTIFICATION_CONFIG: Record<NotificationType, {
    icon: React.ReactNode;
    color: string;
    getMessage: (displayName: string) => string;
}> = {
    mention: {
        icon: <MessageCircle size={16} />,
        color: 'var(--blue-6)',
        getMessage: (name) => `${name} mentioned you`,
    },
    status: {
        icon: <Bell size={16} />,
        color: 'var(--purple-6)',
        getMessage: (name) => `${name} posted`,
    },
    reblog: {
        icon: <Repeat2 size={16} />,
        color: 'var(--green-6)',
        getMessage: (name) => `${name} boosted your post`,
    },
    follow: {
        icon: <UserPlus size={16} />,
        color: 'var(--indigo-6)',
        getMessage: (name) => `${name} followed you`,
    },
    follow_request: {
        icon: <UserPlus size={16} />,
        color: 'var(--orange-6)',
        getMessage: (name) => `${name} requested to follow you`,
    },
    favourite: {
        icon: <Heart size={16} />,
        color: 'var(--red-6)',
        getMessage: (name) => `${name} favourited your post`,
    },
    poll: {
        icon: <BarChart2 size={16} />,
        color: 'var(--teal-6)',
        getMessage: () => `A poll you voted in has ended`,
    },
    update: {
        icon: <Edit2 size={16} />,
        color: 'var(--yellow-6)',
        getMessage: () => `A post you boosted was edited`,
    },
    'admin.sign_up': {
        icon: <UserPlus size={16} />,
        color: 'var(--cyan-6)',
        getMessage: (name) => `${name} signed up`,
    },
    'admin.report': {
        icon: <Bell size={16} />,
        color: 'var(--red-6)',
        getMessage: (name) => `${name} filed a report`,
    },
    'severed_relationships': {
        icon: <Bell size={16} />,
        color: 'var(--orange-6)',
        getMessage: () => 'Some of your follow relationships have been severed',
    },
    'moderation_warning': {
        icon: <Bell size={16} />,
        color: 'var(--red-6)',
        getMessage: () => 'A moderator has taken action against your account',
    },
};

export function NotificationCard({ notification, onDismiss, style, isNew }: NotificationCardProps) {
    const router = useRouter();
    const dismissMutation = useDismissNotification();

    const config = NOTIFICATION_CONFIG[notification.type];
    const account = notification.account;
    const displayName = account.display_name || account.username;

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('a')) {
            return;
        }

        // Navigate based on notification type
        if (notification.status) {
            router.push(`/status/${notification.status.id}`);
        } else {
            router.push(`/@${account.acct}`);
        }
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dismissMutation.mutate(notification.id);
        onDismiss?.(notification.id);
    };

    const CardComponent = isNew ? NewCard : Card;

    return (
        <div style={style}>
            <CardComponent padding="medium" onClick={handleCardClick}>
                <ContentWrapper>
                    {/* Notification type icon */}
                    <IconColumn>
                        <IconCircle $color={config.color}>
                            {config.icon}
                        </IconCircle>
                    </IconColumn>

                    {/* Content */}
                    <ContentColumn>
                        {/* Header with avatar, message, and time */}
                        <HeaderRow>
                            <AvatarLink href={`/@${account.acct}`}>
                                <Avatar
                                    src={account.avatar}
                                    alt={displayName}
                                    size="small"
                                />
                            </AvatarLink>

                            <InfoWrapper>
                                <MessageText>
                                    <AccountLink href={`/@${account.acct}`}>
                                        <EmojiText text={displayName} emojis={account.emojis} />
                                    </AccountLink>
                                    {' '}
                                    <ActionText>
                                        {config.getMessage(displayName).replace(displayName, '').trim()}
                                    </ActionText>
                                </MessageText>
                                <TimeText>
                                    {formatRelativeTime(notification.created_at)}
                                </TimeText>
                            </InfoWrapper>

                            {/* Dismiss button */}
                            <DismissButton size="small" onClick={handleDismiss}>
                                <X size={14} />
                            </DismissButton>
                        </HeaderRow>

                        {/* Status preview (for mention, status, reblog, favourite, poll, update) */}
                        {notification.status && (
                            <StatusPreview>
                                {notification.type === 'mention' ? (
                                    // Full content for mentions
                                    <MentionContent
                                        html={notification.status.content}
                                        emojis={notification.status.emojis}
                                    />
                                ) : (
                                    // Preview for other types
                                    <PreviewContent>
                                        <StatusContent
                                            html={notification.status.content}
                                            emojis={notification.status.emojis}
                                        />
                                    </PreviewContent>
                                )}
                            </StatusPreview>
                        )}
                    </ContentColumn>
                </ContentWrapper>
            </CardComponent>
        </div>
    );
}
