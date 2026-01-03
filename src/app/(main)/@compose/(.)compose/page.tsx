'use client';

import { useSearchParams } from 'next/navigation';
import AuthGuard from '@/components/organisms/AuthGuard';
import { ComposerPanel } from '@/components/organisms/ComposerPanel';
import { ComposeModal } from '@/components/molecules/ComposeModal';
import type { Visibility } from '@/components/molecules/VisibilitySettingsModal';

/**
 * Intercepting route for /compose.
 * When navigating to /compose via client-side navigation,
 * this page renders the compose content inside a modal overlay.
 * 
 * For direct URL visits or page refreshes, the regular /compose/page.tsx is used instead.
 */
export default function ComposeInterceptPage() {
    const searchParams = useSearchParams();
    const quotedStatusId = searchParams.get('quoted_status_id') || undefined;
    const scheduledStatusId = searchParams.get('scheduled_status_id') || undefined;
    const visibility = (searchParams.get('visibility') as Visibility) || undefined;
    const mention = searchParams.get('mention') || undefined;
    const text = searchParams.get('text') || undefined;

    // Create initial content with mention or text if provided
    const initialContent = mention
        ? `<p><span class="mention" data-type="mention" data-id="${mention}" data-label="@${mention}">@${mention}</span> </p>`
        : text
            ? `<p>${text.split('\n').join('</p><p>')}</p>`
            : undefined;

    // Create a unique key that changes when params change to force remount
    const composerKey = [quotedStatusId, scheduledStatusId, visibility, mention, text].filter(Boolean).join('-') || 'default';

    return (
        <AuthGuard>
            <ComposeModal>
                <h1 style={{
                    fontSize: 'var(--font-size-4)',
                    fontWeight: 'var(--font-weight-7)',
                    marginBottom: 'var(--size-3)'
                }}>
                    {visibility === 'direct' ? 'New message' : 'New post'}
                </h1>
                <ComposerPanel
                    key={composerKey}
                    quotedStatusId={quotedStatusId}
                    scheduledStatusId={scheduledStatusId}
                    initialVisibility={visibility}
                    initialContent={initialContent}
                />
            </ComposeModal>
        </AuthGuard>
    );
}
