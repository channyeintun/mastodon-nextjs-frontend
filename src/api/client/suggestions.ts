/**
 * Suggestions API (Follow Recommendations)
 */

import { api } from './base'
import type { Suggestion } from '../../types/mastodon'

export async function getSuggestions(params?: { limit?: number }, signal?: AbortSignal): Promise<Suggestion[]> {
    const { data } = await api.get<Suggestion[]>('/api/v2/suggestions', { params, signal })
    return data
}

export async function deleteSuggestion(accountId: string): Promise<void> {
    await api.delete(`/api/v1/suggestions/${accountId}`)
}
