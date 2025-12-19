/**
 * Scheduled Statuses API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type { ScheduledStatus, ScheduledStatusParams } from '../../types/mastodon'

export async function getScheduledStatuses(params?: { min_id?: string; max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<ScheduledStatus[]>> {
    const response = await api.get<ScheduledStatus[]>('/api/v1/scheduled_statuses', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getScheduledStatus(id: string, signal?: AbortSignal): Promise<ScheduledStatus> {
    const { data } = await api.get<ScheduledStatus>(`/api/v1/scheduled_statuses/${id}`, { signal })
    return data
}

export async function updateScheduledStatus(id: string, params: ScheduledStatusParams): Promise<ScheduledStatus> {
    const { data } = await api.put<ScheduledStatus>(`/api/v1/scheduled_statuses/${id}`, params)
    return data
}

export async function deleteScheduledStatus(id: string): Promise<void> {
    await api.delete(`/api/v1/scheduled_statuses/${id}`)
}
