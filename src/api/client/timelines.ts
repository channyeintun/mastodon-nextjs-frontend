/**
 * Timelines API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type { Status, TimelineParams } from '../../types/mastodon'

export async function getHomeTimeline(params?: TimelineParams, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>('/api/v1/timelines/home', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getPublicTimeline(params?: TimelineParams, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>('/api/v1/timelines/public', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getHashtagTimeline(hashtag: string, params?: TimelineParams, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>(`/api/v1/timelines/tag/${encodeURIComponent(hashtag)}`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getListTimeline(id: string, params?: TimelineParams, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>(`/api/v1/timelines/list/${id}`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}
