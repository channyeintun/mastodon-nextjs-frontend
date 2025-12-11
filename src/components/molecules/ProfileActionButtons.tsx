'use client';

import Link from 'next/link';
import { MoreHorizontal, Ban, VolumeX, Volume2 } from 'lucide-react';
import { Button, IconButton } from '@/components/atoms';
import { useRef, useEffect, useState } from 'react';

interface ProfileActionButtonsProps {
    isOwnProfile: boolean;
    isBlocking: boolean;
    isMuting: boolean;
    isFollowing: boolean;
    isLoading: boolean;
    isMutePending: boolean;
    isBlockPending: boolean;
    acct: string;
    onFollowToggle: () => void;
    onMuteToggle: () => void;
    onBlockToggle: () => void;
}

/**
 * Presentation component for profile action buttons
 * (edit profile, follow/unfollow, mute/block menu).
 */
export function ProfileActionButtons({
    isOwnProfile,
    isBlocking,
    isMuting,
    isFollowing,
    isLoading,
    isMutePending,
    isBlockPending,
    acct,
    onFollowToggle,
    onMuteToggle,
    onBlockToggle,
}: ProfileActionButtonsProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    if (isOwnProfile) {
        return (
            <Link href="/profile/edit">
                <Button variant="secondary">
                    Edit Profile
                </Button>
            </Link>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--size-2)' }}>
            {!isBlocking && (
                <Button
                    variant={isFollowing ? 'secondary' : 'primary'}
                    onClick={onFollowToggle}
                    isLoading={isLoading}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            )}

            {/* More actions menu */}
            <div ref={menuRef} style={{ position: 'relative' }}>
                <IconButton
                    onClick={() => setShowMenu(!showMenu)}
                    style={{
                        border: '1px solid var(--surface-3)',
                        borderRadius: 'var(--radius-round)',
                    }}
                >
                    <MoreHorizontal size={20} />
                </IconButton>

                {showMenu && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 'var(--size-2)',
                        background: 'var(--surface-2)',
                        borderRadius: 'var(--radius-2)',
                        boxShadow: 'var(--shadow-3)',
                        overflow: 'hidden',
                        zIndex: 50,
                        minWidth: '180px',
                        border: '1px solid var(--surface-3)',
                    }}>
                        {/* Mute option */}
                        <button
                            onClick={() => {
                                onMuteToggle();
                                setShowMenu(false);
                            }}
                            disabled={isMutePending}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--size-2)',
                                width: '100%',
                                padding: 'var(--size-3)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-1)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-size-1)',
                                textAlign: 'left',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {isMuting ? (
                                <>
                                    <Volume2 size={18} />
                                    Unmute @{acct}
                                </>
                            ) : (
                                <>
                                    <VolumeX size={18} />
                                    Mute @{acct}
                                </>
                            )}
                        </button>

                        {/* Block option */}
                        <button
                            onClick={() => {
                                onBlockToggle();
                                setShowMenu(false);
                            }}
                            disabled={isBlockPending}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--size-2)',
                                width: '100%',
                                padding: 'var(--size-3)',
                                background: 'transparent',
                                border: 'none',
                                color: isBlocking ? 'var(--text-1)' : 'var(--red-6)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-size-1)',
                                textAlign: 'left',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Ban size={18} />
                            {isBlocking ? `Unblock @${acct}` : `Block @${acct}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
