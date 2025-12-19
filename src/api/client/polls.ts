/**
 * Polls API
 */

import { api } from './base'
import type { Poll } from '../../types/mastodon'

export async function getPoll(id: string, signal?: AbortSignal): Promise<Poll> {
    const { data } = await api.get<Poll>(`/api/v1/polls/${id}`, { signal })
    return data
}

export async function votePoll(id: string, choices: number[]): Promise<Poll> {
    const { data } = await api.post<Poll>(`/api/v1/polls/${id}/votes`, { choices })
    return data
}
