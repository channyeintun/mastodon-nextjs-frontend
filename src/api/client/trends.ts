/**
 * Trends API
 */

import { api } from './base'
import type { Status, Tag, TrendingLink } from '../../types/mastodon'

export async function getTrendingStatuses(params?: { limit?: number; offset?: number }): Promise<Status[]> {
    const { data } = await api.get<Status[]>('/api/v1/trends/statuses', { params })
    return data
}

export async function getTrendingTags(params?: { limit?: number; offset?: number }): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/api/v1/trends/tags', { params })
    return data
}

export async function getTrendingLinks(params?: { limit?: number; offset?: number }): Promise<TrendingLink[]> {
    const { data } = await api.get<TrendingLink[]>('/api/v1/trends/links', { params })
    return data
}
