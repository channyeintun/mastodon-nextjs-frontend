/**
 * Statuses API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type {
    Status,
    CreateStatusParams,
    Context,
    StatusEdit,
    StatusSource,
    Account,
    Translation
} from '../../types/mastodon'

// CRUD
export async function getStatus(id: string, signal?: AbortSignal): Promise<Status> {
    const { data } = await api.get<Status>(`/api/v1/statuses/${id}`, { signal })
    return data
}

export async function createStatus(params: CreateStatusParams): Promise<Status> {
    const { data } = await api.post<Status>('/api/v1/statuses', params)
    return data
}

export async function deleteStatus(id: string): Promise<Status> {
    const { data } = await api.delete<Status>(`/api/v1/statuses/${id}`)
    return data
}

export async function updateStatus(id: string, params: CreateStatusParams): Promise<Status> {
    const { data } = await api.put<Status>(`/api/v1/statuses/${id}`, params)
    return data
}

// Context
export async function getStatusContext(id: string, signal?: AbortSignal): Promise<Context> {
    const { data } = await api.get<Context>(`/api/v1/statuses/${id}/context`, { signal })
    return data
}

// Interactions
export async function favouriteStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/favourite`)
    return data
}

export async function unfavouriteStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/unfavourite`)
    return data
}

export async function reblogStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/reblog`)
    return data
}

export async function unreblogStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/unreblog`)
    return data
}

export async function bookmarkStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/bookmark`)
    return data
}

export async function unbookmarkStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/unbookmark`)
    return data
}

export async function muteConversation(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/mute`)
    return data
}

export async function unmuteConversation(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/unmute`)
    return data
}

export async function pinStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/pin`)
    return data
}

export async function unpinStatus(id: string): Promise<Status> {
    const { data } = await api.post<Status>(`/api/v1/statuses/${id}/unpin`)
    return data
}

// History and Source
export async function getStatusHistory(id: string, signal?: AbortSignal): Promise<StatusEdit[]> {
    const { data } = await api.get<StatusEdit[]>(`/api/v1/statuses/${id}/history`, { signal })
    return data
}

export async function getStatusSource(id: string, signal?: AbortSignal): Promise<StatusSource> {
    const { data } = await api.get<StatusSource>(`/api/v1/statuses/${id}/source`, { signal })
    return data
}

// Stats
export async function getFavouritedBy(id: string, params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>(`/api/v1/statuses/${id}/favourited_by`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getRebloggedBy(id: string, params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>(`/api/v1/statuses/${id}/reblogged_by`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getStatusQuotes(id: string, params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>(`/api/v1/statuses/${id}/quotes`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

// Translation
export async function translateStatus(id: string): Promise<Translation> {
    const { data } = await api.post<Translation>(`/api/v1/statuses/${id}/translate`)
    return data
}

// Bookmarks list
export async function getBookmarks(params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>('/api/v1/bookmarks', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}
