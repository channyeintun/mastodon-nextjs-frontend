/**
 * Lists API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type { List, Account, CreateListParams, UpdateListParams } from '../../types/mastodon'

export async function getLists(signal?: AbortSignal): Promise<List[]> {
    const { data } = await api.get<List[]>('/api/v1/lists', { signal })
    return data
}

export async function getList(id: string, signal?: AbortSignal): Promise<List> {
    const { data } = await api.get<List>(`/api/v1/lists/${id}`, { signal })
    return data
}

export async function createList(params: CreateListParams): Promise<List> {
    const { data } = await api.post<List>('/api/v1/lists', params)
    return data
}

export async function updateList(id: string, params: UpdateListParams): Promise<List> {
    const { data } = await api.put<List>(`/api/v1/lists/${id}`, params)
    return data
}

export async function deleteList(id: string): Promise<void> {
    await api.delete(`/api/v1/lists/${id}`)
}

export async function getListAccounts(id: string, params?: { max_id?: string; since_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>(`/api/v1/lists/${id}/accounts`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function addAccountsToList(listId: string, accountIds: string[]): Promise<void> {
    await api.post(`/api/v1/lists/${listId}/accounts`, { account_ids: accountIds })
}

export async function removeAccountsFromList(listId: string, accountIds: string[]): Promise<void> {
    await api.delete(`/api/v1/lists/${listId}/accounts`, { data: { account_ids: accountIds } })
}
