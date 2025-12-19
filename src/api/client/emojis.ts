/**
 * Custom Emojis API
 * Uses conditional requests with ETag to avoid re-fetching unchanged data
 */

import { get, set, createStore } from 'idb-keyval'
import { api } from './base'
import type { Emoji } from '../../types/mastodon'

const EMOJI_ETAG_KEY = 'emoji_etag'
// Use the same IndexedDB store as the TanStack Query persister
const emojiStore = createStore('mastodon-cache', 'query-store')

// Custom error class to signal 304 Not Modified
export class NotModifiedError extends Error {
    constructor() {
        super('Not Modified')
        this.name = 'NotModifiedError'
    }
}

export async function getCustomEmojis(signal?: AbortSignal): Promise<Emoji[]> {
    // Get stored ETag for conditional request (from IndexedDB)
    const storedETag = typeof window !== 'undefined'
        ? await get<string>(EMOJI_ETAG_KEY, emojiStore)
        : null

    const headers: Record<string, string> = {}
    if (storedETag) {
        headers['If-None-Match'] = storedETag
    }

    const response = await api.get<Emoji[]>('/api/v1/custom_emojis', {
        signal,
        headers,
        // Don't throw on 304 - we need to handle it
        validateStatus: (status) => status === 200 || status === 304,
    })

    // 304 Not Modified - throw special error for TanStack Query to use stale data
    if (response.status === 304) {
        throw new NotModifiedError()
    }

    // 200 OK - store ETag for next request (in IndexedDB)
    const newETag = response.headers.etag
    if (newETag && typeof window !== 'undefined') {
        await set(EMOJI_ETAG_KEY, newETag, emojiStore)
    }

    return response.data
}
