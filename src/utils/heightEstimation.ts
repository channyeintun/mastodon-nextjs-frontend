import type { Status } from '@/types';

/**
 * Estimates the height of a PostCard based on its status data.
 * This is used to provide a more accurate estimateSize to TanStack Virtual,
 * which helps prevent scrolling glitches cuando moving backwards.
 * 
 * Approximate measurements:
 * - Header/Footer/Actions: ~100px
 * - Content Warning: ~40px
 * - Content: ~24px per line (approx 50 chars per line for desktop, 30 for mobile)
 * - Media Container: up to 550px (capped in postCardStyles.ts)
 * - Poll: ~50px per option + ~40px header/footer
 * - Quote: Recursively estimate or use a flat ~150px overhead
 */
export function estimateStatusHeight(status: Status, isMobile: boolean): number {
    let height = 100; // Base height for header and actions

    // 1. Content Height
    if (status.content) {
        // Strip HTML tags to get raw text length
        const rawText = status.content.replace(/<[^>]*>/g, '');
        const charsPerLine = isMobile ? 30 : 50;
        const lineCount = Math.ceil(rawText.length / charsPerLine) || 1;
        height += lineCount * 24;
    }

    // 2. Content Warning
    if (status.spoiler_text) {
        height += 40;
    }

    // 3. Media Height
    if (status.media_attachments && status.media_attachments.length > 0) {
        if (status.media_attachments.length === 1) {
            const media = status.media_attachments[0];
            const aspect = media.meta?.original?.aspect || (media.meta?.small?.aspect) || 1.777;
            // Max height is 550px in CSS
            const estimatedWidth = isMobile ? 400 : 600;
            const calculatedHeight = Math.min(550, estimatedWidth / aspect);
            height += calculatedHeight + 20; // + gap
        } else {
            // Multi-media grid is usually shorter per row or capped
            height += 300;
        }
    } else if (status.card) {
        // Link preview
        height += 120;
    }

    // 4. Poll
    if (status.poll) {
        height += 40 + (status.poll.options.length * 50);
    }

    // 5. Quote
    if (status.quote?.quoted_status) {
        height += 150; // Flat overhead for quote
    }

    // Add some padding/margin
    height += 24;

    return height;
}
