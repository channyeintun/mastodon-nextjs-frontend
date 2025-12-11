'use client';

import { Repeat2 } from 'lucide-react';
import { EmojiText } from '@/components/atoms';
import type { Account } from '@/types';

interface ReblogIndicatorProps {
    account: Account;
}

/**
 * Presentation component that displays a reblog/boost indicator
 * showing who boosted the post.
 */
export function ReblogIndicator({ account }: ReblogIndicatorProps) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--size-2)',
            marginBottom: 'var(--size-2)',
            fontSize: 'var(--font-size-0)',
            color: 'var(--text-2)',
        }}>
            <Repeat2 size={14} style={{ marginLeft: 'var(--size-6)' }} />
            <span>
                <strong>
                    <EmojiText
                        text={account.display_name || account.username}
                        emojis={account.emojis}
                    />
                </strong> boosted
            </span>
        </div>
    );
}
