/**
 * Filters API (v2)
 */

import { api } from './base'
import type { Filter, CreateFilterParams, UpdateFilterParams } from '../../types/mastodon'

export async function getFilters(signal?: AbortSignal): Promise<Filter[]> {
    const { data } = await api.get<Filter[]>('/api/v2/filters', { signal })
    return data
}

export async function getFilter(id: string, signal?: AbortSignal): Promise<Filter> {
    const { data } = await api.get<Filter>(`/api/v2/filters/${id}`, { signal })
    return data
}

export async function createFilter(params: CreateFilterParams): Promise<Filter> {
    const { data } = await api.post<Filter>('/api/v2/filters', params)
    return data
}

export async function updateFilter(id: string, params: UpdateFilterParams): Promise<Filter> {
    const { data } = await api.put<Filter>(`/api/v2/filters/${id}`, params)
    return data
}

export async function deleteFilter(id: string): Promise<void> {
    await api.delete(`/api/v2/filters/${id}`)
}
