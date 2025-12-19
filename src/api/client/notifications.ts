/**
 * Notifications API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type {
    Notification,
    NotificationParams,
    GroupedNotificationParams,
    GroupedNotificationsResults,
    UnreadCount,
    NotificationRequest,
    NotificationRequestParams,
    NotificationPolicy,
    NotificationPolicyV1,
    UpdateNotificationPolicyParams,
    UpdateNotificationPolicyV1Params
} from '../../types/mastodon'

// Notifications (v1)
export async function getNotifications(params?: NotificationParams, signal?: AbortSignal): Promise<PaginatedResponse<Notification[]>> {
    const response = await api.get<Notification[]>('/api/v1/notifications', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getNotification(id: string, signal?: AbortSignal): Promise<Notification> {
    const { data } = await api.get<Notification>(`/api/v1/notifications/${id}`, { signal })
    return data
}

export async function dismissNotification(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/${id}/dismiss`)
}

export async function clearNotifications(): Promise<void> {
    await api.post('/api/v1/notifications/clear')
}

export async function getUnreadNotificationCount(signal?: AbortSignal): Promise<UnreadCount> {
    const { data } = await api.get<UnreadCount>('/api/v1/notifications/unread_count', { signal })
    return data
}

// Grouped Notifications (v2)
export async function getGroupedNotifications(
    params?: GroupedNotificationParams,
    signal?: AbortSignal
): Promise<PaginatedResponse<GroupedNotificationsResults>> {
    const response = await api.get<GroupedNotificationsResults>('/api/v2/notifications', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function dismissNotificationGroup(groupKey: string): Promise<void> {
    await api.post(`/api/v2/notifications/${encodeURIComponent(groupKey)}/dismiss`)
}

// Markers (for tracking read position)
export interface Marker {
    last_read_id: string
    version: number
    updated_at: string
}

export interface MarkersResponse {
    notifications?: Marker
    home?: Marker
}

export async function getMarkers(timeline: ('home' | 'notifications')[], signal?: AbortSignal): Promise<MarkersResponse> {
    const { data } = await api.get<MarkersResponse>('/api/v1/markers', {
        params: { 'timeline[]': timeline },
        signal,
    })
    return data
}

export async function updateMarkers(params: {
    home?: { last_read_id: string }
    notifications?: { last_read_id: string }
}): Promise<MarkersResponse> {
    const { data } = await api.post<MarkersResponse>('/api/v1/markers', params)
    return data
}

// Notification Requests
export async function getNotificationRequests(
    params?: NotificationRequestParams,
    signal?: AbortSignal
): Promise<PaginatedResponse<NotificationRequest[]>> {
    const response = await api.get<NotificationRequest[]>('/api/v1/notifications/requests', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getNotificationRequest(id: string, signal?: AbortSignal): Promise<NotificationRequest> {
    const { data } = await api.get<NotificationRequest>(`/api/v1/notifications/requests/${id}`, { signal })
    return data
}

export async function acceptNotificationRequest(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/requests/${id}/accept`)
}

export async function dismissNotificationRequest(id: string): Promise<void> {
    await api.post(`/api/v1/notifications/requests/${id}/dismiss`)
}

export async function acceptNotificationRequests(ids: string[]): Promise<void> {
    await api.post('/api/v1/notifications/requests/accept', { id: ids })
}

export async function dismissNotificationRequests(ids: string[]): Promise<void> {
    await api.post('/api/v1/notifications/requests/dismiss', { id: ids })
}

// Notification Policy V1 (boolean-based: filter_not_following, etc.)
export async function getNotificationPolicyV1(signal?: AbortSignal): Promise<NotificationPolicyV1> {
    const { data } = await api.get<NotificationPolicyV1>('/api/v1/notifications/policy', { signal })
    return data
}

export async function updateNotificationPolicyV1(
    params: UpdateNotificationPolicyV1Params
): Promise<NotificationPolicyV1> {
    const { data } = await api.put<NotificationPolicyV1>('/api/v1/notifications/policy', params)
    return data
}

// Notification Policy V2 (string-based: for_not_following = 'accept'|'filter'|'drop', etc.)
export async function getNotificationPolicy(signal?: AbortSignal): Promise<NotificationPolicy> {
    const { data } = await api.get<NotificationPolicy>('/api/v2/notifications/policy', { signal })
    return data
}

export async function updateNotificationPolicy(
    params: UpdateNotificationPolicyParams
): Promise<NotificationPolicy> {
    const { data } = await api.put<NotificationPolicy>('/api/v2/notifications/policy', params)
    return data
}
