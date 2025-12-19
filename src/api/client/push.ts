/**
 * Push Subscriptions API
 */

import { api } from './base'
import type {
    WebPushSubscription,
    CreatePushSubscriptionParams,
    UpdatePushSubscriptionParams
} from '../../types/mastodon'

export async function getPushSubscription(signal?: AbortSignal): Promise<WebPushSubscription | null> {
    try {
        const { data } = await api.get<WebPushSubscription>('/api/v1/push/subscription', { signal })
        return data
    } catch (error) {
        // 404 means no subscription exists - that's not an error, just return null
        if (error instanceof Error && (error.message.includes('404') || error.message.toLowerCase().includes('not found'))) {
            return null
        }
        throw error
    }
}

export async function createPushSubscription(params: CreatePushSubscriptionParams): Promise<WebPushSubscription> {
    const { data } = await api.post<WebPushSubscription>('/api/v1/push/subscription', params)
    return data
}

export async function updatePushSubscription(params: UpdatePushSubscriptionParams): Promise<WebPushSubscription> {
    const { data } = await api.put<WebPushSubscription>('/api/v1/push/subscription', params)
    return data
}

export async function deletePushSubscription(): Promise<void> {
    await api.delete('/api/v1/push/subscription')
}
