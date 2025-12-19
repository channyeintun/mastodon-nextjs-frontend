/**
 * Accounts API
 */

import { api, wrapPaginatedResponse, type PaginatedResponse } from './base'
import type {
    Account,
    Relationship,
    TimelineParams,
    Status,
    UpdateAccountParams,
    MuteAccountParams,
    List
} from '../../types/mastodon'

// Get account
export async function getAccount(id: string, signal?: AbortSignal): Promise<Account> {
    const { data } = await api.get<Account>(`/api/v1/accounts/${id}`, { signal })
    return data
}

export async function lookupAccount(acct: string, signal?: AbortSignal): Promise<Account> {
    const { data } = await api.get<Account>(`/api/v1/accounts/lookup`, {
        params: { acct },
        signal,
    })
    return data
}

// Credentials
export async function verifyCredentials(signal?: AbortSignal): Promise<Account> {
    const { data } = await api.get<Account>('/api/v1/accounts/verify_credentials', { signal })
    return data
}

export async function updateCredentials(params: UpdateAccountParams): Promise<Account> {
    const formData = new FormData()

    // Add text fields
    if (params.display_name !== undefined) {
        formData.append('display_name', params.display_name)
    }
    if (params.note !== undefined) {
        formData.append('note', params.note)
    }
    if (params.locked !== undefined) {
        formData.append('locked', String(params.locked))
    }
    if (params.bot !== undefined) {
        formData.append('bot', String(params.bot))
    }
    if (params.discoverable !== undefined) {
        formData.append('discoverable', String(params.discoverable))
    }
    if (params.hide_collections !== undefined) {
        formData.append('hide_collections', String(params.hide_collections))
    }
    if (params.indexable !== undefined) {
        formData.append('indexable', String(params.indexable))
    }

    // Add file fields
    if (params.avatar) {
        formData.append('avatar', params.avatar)
    }
    if (params.header) {
        formData.append('header', params.header)
    }

    // Add fields_attributes
    if (params.fields_attributes) {
        params.fields_attributes.forEach((field, index) => {
            formData.append(`fields_attributes[${index}][name]`, field.name)
            formData.append(`fields_attributes[${index}][value]`, field.value)
        })
    }

    // Add source fields for posting defaults
    if (params.source) {
        if (params.source.privacy !== undefined) {
            formData.append('source[privacy]', params.source.privacy)
        }
        if (params.source.sensitive !== undefined) {
            formData.append('source[sensitive]', String(params.source.sensitive))
        }
        if (params.source.language !== undefined) {
            formData.append('source[language]', params.source.language)
        }
        if (params.source.quote_policy !== undefined) {
            formData.append('source[quote_policy]', params.source.quote_policy)
        }
    }

    const { data } = await api.patch<Account>('/api/v1/accounts/update_credentials', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}

// Account statuses
export async function getAccountStatuses(
    id: string,
    params?: TimelineParams,
    signal?: AbortSignal,
): Promise<PaginatedResponse<Status[]>> {
    const response = await api.get<Status[]>(`/api/v1/accounts/${id}/statuses`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getPinnedStatuses(id: string, signal?: AbortSignal): Promise<Status[]> {
    const { data } = await api.get<Status[]>(`/api/v1/accounts/${id}/statuses`, {
        params: { pinned: true },
        signal,
    })
    return data
}

// Followers/Following
export async function getFollowers(id: string, params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>(`/api/v1/accounts/${id}/followers`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function getFollowing(id: string, params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>(`/api/v1/accounts/${id}/following`, { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export interface FollowAccountParams {
    notify?: boolean
    reblogs?: boolean
}

export async function followAccount(id: string, params?: FollowAccountParams): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/follow`, params)
    return data
}

export async function unfollowAccount(id: string): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/unfollow`)
    return data
}

// Relationships
export async function getRelationships(ids: string[], signal?: AbortSignal): Promise<Relationship[]> {
    // Build the query string manually to ensure correct format: id[]=1&id[]=2
    const params = new URLSearchParams()
    ids.forEach(id => params.append('id[]', id))
    params.append('with_suspended', 'true')

    const { data } = await api.get<Relationship[]>(`/api/v1/accounts/relationships?${params.toString()}`, {
        signal,
    })
    return data
}

// Follow Requests
export async function getFollowRequests(params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>('/api/v1/follow_requests', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

export async function acceptFollowRequest(id: string): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/follow_requests/${id}/authorize`)
    return data
}

export async function rejectFollowRequest(id: string): Promise<void> {
    await api.post(`/api/v1/follow_requests/${id}/reject`)
}

// Block/Unblock
export async function blockAccount(id: string): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/block`)
    return data
}

export async function unblockAccount(id: string): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/unblock`)
    return data
}

export async function getBlockedAccounts(params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>('/api/v1/blocks', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

// Mute/Unmute
export async function muteAccount(id: string, params?: MuteAccountParams): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/mute`, params)
    return data
}

export async function unmuteAccount(id: string): Promise<Relationship> {
    const { data } = await api.post<Relationship>(`/api/v1/accounts/${id}/unmute`)
    return data
}

export async function getMutedAccounts(params?: { max_id?: string; limit?: number }, signal?: AbortSignal): Promise<PaginatedResponse<Account[]>> {
    const response = await api.get<Account[]>('/api/v1/mutes', { params, signal })
    return wrapPaginatedResponse(response.data, response.headers.link)
}

// Account lists
export async function getAccountLists(accountId: string, signal?: AbortSignal): Promise<List[]> {
    const { data } = await api.get<List[]>(`/api/v1/accounts/${accountId}/lists`, { signal })
    return data
}

// Familiar Followers
export interface FamiliarFollowersResult {
    id: string
    accounts: Account[]
}

export async function getFamiliarFollowers(id: string, signal?: AbortSignal): Promise<FamiliarFollowersResult[]> {
    const params = new URLSearchParams()
    params.append('id[]', id)
    const { data } = await api.get<FamiliarFollowersResult[]>(`/api/v1/accounts/familiar_followers?${params.toString()}`, { signal })
    return data
}
