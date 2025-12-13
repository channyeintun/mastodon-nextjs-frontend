/**
 * Conversation utility functions using Ramda
 */

import * as R from 'ramda'
import type { Status, Context, Conversation } from '@/types/mastodon'

// Check if status with given id exists in array
export const hasStatusWithId = (id: string) => R.any<Status>(R.propEq(id, 'id'))

// Get last status id or fallback
export const getLastStatusId = (statuses: Status[], fallback?: string) =>
    R.pipe(
        R.last<Status>,
        R.ifElse(R.isNil, R.always(fallback), R.prop('id'))
    )(statuses)

// Find conversation by id in pages
export const findConversationById = (id: string | null) =>
    R.pipe(
        R.chain<Conversation[], Conversation>(R.identity),
        R.find<Conversation>(R.propEq(id, 'id'))
    )

// Build message list from context
export const buildMessageList = (ancestors: Status[], descendants: Status[], original: Status | null): Status[] => {
    const isInArray = (statusId: string, arr: Status[]) => R.any(R.propEq(statusId, 'id'), arr)

    if (original && !isInArray(original.id, ancestors) && !isInArray(original.id, descendants)) {
        return [...ancestors, original, ...descendants]
    }
    return [...ancestors, ...descendants]
}

// Append status to descendants if not exists
export const appendIfNotExists = (status: Status) => (old: Context | undefined): Context | undefined => {
    if (!old) return old
    if (hasStatusWithId(status.id)(old.descendants)) return old
    return { ...old, descendants: R.append(status, old.descendants) }
}

// Strip mentions from HTML content
export const stripMentions = (html: string): string => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    temp.querySelectorAll('.mention, a.mention, span.mention').forEach(m => m.remove())
    let text = temp.innerHTML
    let prev = ''
    while (prev !== text) {
        prev = text
        text = text.replace(/^(<p[^>]*>)?\s*@[\w.-]+(@[\w.-]+)?\s*/gi, '$1')
    }
    text = text.replace(/<p[^>]*>\s*<\/p>/gi, '')
    return R.ifElse(R.complement(R.isEmpty), R.identity, R.always('<p>&nbsp;</p>'))(text.trim())
}
