/**
 * Custom Emojis API
 * Note: ETag-based conditional requests were removed because Mastodon's 304 responses
 * don't include CORS headers, causing cross-origin requests to fail.
 * We rely on TanStack Query's caching with IndexedDB persister instead.
 */

import { api } from './base'
import type { Emoji } from '../../types/mastodon'

// Keep the error class for backwards compatibility (even though we don't use it anymore)
export class NotModifiedError extends Error {
    constructor() {
        super('Not Modified')
        this.name = 'NotModifiedError'
    }
}

export async function getCustomEmojis(signal?: AbortSignal): Promise<Emoji[]> {
    const response = await api.get<Emoji[]>('/api/v1/custom_emojis', {
        signal,
    })

    return response.data
}
