'use client';

import {
    Heart,
    Repeat2,
    MessageCircle,
    Bookmark,
    Share,
    MessageSquareQuote,
} from 'lucide-react';
import { IconButton } from '@/components/atoms';

interface PostActionsProps {
    repliesCount: number;
    reblogsCount: number;
    favouritesCount: number;
    reblogged?: boolean;
    favourited?: boolean;
    bookmarked?: boolean;
    onReply: (e: React.MouseEvent) => void;
    onReblog: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onConfirmReblog: (e: React.MouseEvent) => void;
    onQuote: (e: React.MouseEvent) => void;
    onFavourite: (e: React.MouseEvent) => void;
    onBookmark: (e: React.MouseEvent) => void;
    onShare: (e: React.MouseEvent) => void;
}

/**
 * Presentation component for post action buttons
 * (reply, boost, favourite, bookmark, share).
 */
export function PostActions({
    repliesCount,
    reblogsCount,
    favouritesCount,
    reblogged = false,
    favourited = false,
    bookmarked = false,
    onReply,
    onReblog,
    onConfirmReblog,
    onQuote,
    onFavourite,
    onBookmark,
    onShare,
}: PostActionsProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--size-1)',
            marginTop: 'var(--size-3)',
        }}>
            {/* Reply */}
            <IconButton
                size="small"
                onClick={onReply}
                title="Reply"
            >
                <MessageCircle size={16} />
            </IconButton>
            <span style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-2)' }}>
                {repliesCount}
            </span>

            {/* Boost with popover */}
            <div className="boost-btn" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <IconButton
                    size="small"
                    onClick={onReblog}
                    style={{
                        color: reblogged ? 'var(--green-6)' : undefined
                    }}
                    title={reblogged ? 'Undo boost' : 'Boost'}
                >
                    <Repeat2 size={16} />
                </IconButton>
                <div
                    className="boost-popover"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: 'var(--size-2)',
                        background: 'var(--surface-2)',
                        borderRadius: 'var(--radius-2)',
                        boxShadow: 'var(--shadow-4)',
                        padding: 'var(--size-2)',
                        minWidth: '150px',
                        zIndex: 50,
                        gap: 'var(--size-1)',
                    }}
                >
                    <button
                        onClick={onConfirmReblog}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--size-2)',
                            padding: 'var(--size-2)',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: 'var(--radius-2)',
                            cursor: 'pointer',
                            color: reblogged ? 'var(--green-6)' : 'var(--text-1)',
                            fontSize: 'var(--font-size-1)',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--surface-3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <Repeat2 size={16} />
                        <span>{reblogged ? 'Undo Boost' : 'Boost'}</span>
                    </button>
                    <button
                        onClick={onQuote}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--size-2)',
                            padding: 'var(--size-2)',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: 'var(--radius-2)',
                            cursor: 'pointer',
                            color: 'var(--text-1)',
                            fontSize: 'var(--font-size-1)',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--surface-3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <MessageSquareQuote size={16} />
                        <span>Quote</span>
                    </button>
                </div>
            </div>
            <span style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-2)' }}>
                {reblogsCount}
            </span>

            {/* Favourite */}
            <IconButton
                size="small"
                onClick={onFavourite}
                style={{
                    color: favourited ? 'var(--red-6)' : undefined
                }}
                title={favourited ? 'Unfavourite' : 'Favourite'}
            >
                <Heart size={16} fill={favourited ? 'currentColor' : 'none'} />
            </IconButton>
            <span style={{ fontSize: 'var(--font-size-0)', color: 'var(--text-2)' }}>
                {favouritesCount}
            </span>

            {/* Right side actions */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--size-1)' }}>
                <IconButton
                    size="small"
                    onClick={onBookmark}
                    style={{
                        color: bookmarked ? 'var(--blue-6)' : undefined
                    }}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                    <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={onShare}
                    title="Share"
                >
                    <Share size={16} />
                </IconButton>
            </div>
        </div>
    );
}
