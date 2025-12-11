'use client';

import Link from 'next/link';
import {
    Globe,
    Lock,
    Users,
    Mail,
    MoreHorizontal,
    Trash2,
    Edit2,
    Pin,
    PinOff,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { Avatar, IconButton, EmojiText } from '@/components/atoms';
import type { Account } from '@/types';

type Visibility = 'public' | 'unlisted' | 'private' | 'direct';

interface PostHeaderProps {
    account: Account;
    createdAt: string;
    visibility: Visibility;
    statusId: string;
    isOwnPost: boolean;
    pinned?: boolean;
    muted?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onPin?: () => void;
    onMute?: () => void;
}

const VISIBILITY_ICONS = {
    public: <Globe size={14} />,
    unlisted: <Lock size={14} />,
    private: <Users size={14} />,
    direct: <Mail size={14} />,
};

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

/**
 * Presentation component for post author header with avatar,
 * display name, handle, timestamp, visibility, and options menu.
 */
export function PostHeader({
    account,
    createdAt,
    visibility,
    statusId,
    isOwnPost,
    pinned = false,
    muted = false,
    onEdit,
    onDelete,
    onPin,
    onMute,
}: PostHeaderProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-2)' }}>
            <Link
                href={`/@${account.acct}`}
                style={{ textDecoration: 'none', flexShrink: 0 }}
            >
                <Avatar
                    src={account.avatar}
                    alt={account.display_name || account.username}
                    size="medium"
                />
            </Link>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ minWidth: 0 }}>
                        <Link
                            href={`/@${account.acct}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div style={{
                                fontWeight: 'var(--font-weight-6)',
                                color: 'var(--text-1)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                <EmojiText
                                    text={account.display_name || account.username}
                                    emojis={account.emojis}
                                />
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-0)',
                                color: 'var(--text-2)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                @{account.acct}
                            </div>
                        </Link>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--size-2)',
                        flexShrink: 0,
                    }}>
                        <Link
                            href={`/status/${statusId}`}
                            style={{
                                textDecoration: 'none',
                                fontSize: 'var(--font-size-0)',
                                color: 'var(--text-2)',
                            }}
                        >
                            {formatRelativeTime(createdAt)}
                        </Link>
                        <div style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center' }} title={visibility}>
                            {VISIBILITY_ICONS[visibility]}
                        </div>
                        {isOwnPost && (
                            <div className="options-menu-btn">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.focus();
                                    }}
                                >
                                    <MoreHorizontal size={16} />
                                </IconButton>

                                <div className="options-menu-popover">
                                    {/* Pin/Unpin - Only for own public/unlisted posts */}
                                    {(visibility === 'public' || visibility === 'unlisted') && onPin && (
                                        <button
                                            className="options-menu-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onPin();
                                            }}
                                        >
                                            {pinned ? <PinOff size={16} /> : <Pin size={16} />}
                                            <span>{pinned ? 'Unpin from profile' : 'Pin on profile'}</span>
                                        </button>
                                    )}

                                    {/* Mute/Unmute Conversation */}
                                    {onMute && (
                                        <button
                                            className="options-menu-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onMute();
                                            }}
                                        >
                                            {muted ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                            <span>{muted ? 'Unmute conversation' : 'Mute conversation'}</span>
                                        </button>
                                    )}

                                    <div style={{ height: '1px', background: 'var(--surface-3)', margin: '4px 0' }} />

                                    {onEdit && (
                                        <button
                                            className="options-menu-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onEdit();
                                            }}
                                        >
                                            <Edit2 size={16} />
                                            <span>Edit status</span>
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            className="options-menu-item danger"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onDelete();
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            <span>Delete status</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
