/**
 * Search API
 */

import { api } from './base'
import type { SearchParams, SearchResults } from '../../types/mastodon'

export async function search(params: SearchParams, signal?: AbortSignal): Promise<SearchResults> {
    // Filter out undefined values to avoid "type=undefined" in query string
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
    )
    const { data } = await api.get<SearchResults>('/api/v2/search', {
        params: filteredParams,
        signal,
    })
    return data
}
