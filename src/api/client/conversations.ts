/**
 * Conversations API (Direct Messages)
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type { Conversation, ConversationParams } from '../../types/mastodon'

export async function getConversations(params?: ConversationParams, signal?: AbortSignal): Promise<PaginatedResponse<Conversation[]>> {
    const response = await api.get<Conversation[]>('/api/v1/conversations', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function deleteConversation(id: string): Promise<void> {
    await api.delete(`/api/v1/conversations/${id}`)
}

export async function markConversationAsRead(id: string): Promise<Conversation> {
    const { data } = await api.post<Conversation>(`/api/v1/conversations/${id}/read`)
    return data
}
