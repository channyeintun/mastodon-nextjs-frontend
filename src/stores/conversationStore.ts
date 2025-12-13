/**
 * Conversation Store
 * Manages the active conversation and chat data for the chat page
 * Uses sessionStorage for persistence - persists on refresh, clears on tab close
 */

import { makeAutoObservable } from 'mobx'
import type { Conversation } from '@/types/mastodon'

const CONVERSATION_KEY = 'active_conversation_data'
const LAST_STATUS_ID_KEY = 'active_conversation_last_status_id'

export class ConversationStore {
    cachedConversation: Conversation | null = null
    lastStatusId: string | null = null

    constructor() {
        makeAutoObservable(this)

        // Load from sessionStorage on init (client-side only)
        if (typeof window !== 'undefined') {
            const storedConversation = sessionStorage.getItem(CONVERSATION_KEY)
            if (storedConversation) {
                try {
                    this.cachedConversation = JSON.parse(storedConversation)
                } catch {
                    sessionStorage.removeItem(CONVERSATION_KEY)
                }
            }
            this.lastStatusId = sessionStorage.getItem(LAST_STATUS_ID_KEY)
        }
    }

    /**
     * Get the active conversation ID from cached conversation
     */
    get activeConversationId(): string | null {
        return this.cachedConversation?.id ?? null
    }

    /**
     * Store the full conversation object - writes to sessionStorage synchronously
     */
    setConversation(conversation: Conversation) {
        this.cachedConversation = conversation
        // Also set the last status ID from the conversation
        if (conversation.last_status?.id) {
            this.lastStatusId = conversation.last_status.id
        }
        // Write to sessionStorage synchronously to ensure data is available before navigation
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(CONVERSATION_KEY, JSON.stringify(conversation))
            if (conversation.last_status?.id) {
                sessionStorage.setItem(LAST_STATUS_ID_KEY, conversation.last_status.id)
            }
        }
    }

    setLastStatusId(id: string) {
        this.lastStatusId = id
        // Write to sessionStorage synchronously
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(LAST_STATUS_ID_KEY, id)
        }
    }

    /**
     * Clear all conversation data - call when leaving chat detail page
     */
    clearConversation() {
        this.cachedConversation = null
        this.lastStatusId = null
        // Clear from sessionStorage synchronously
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(CONVERSATION_KEY)
            sessionStorage.removeItem(LAST_STATUS_ID_KEY)
        }
    }

    /**
     * @deprecated Use clearConversation instead
     */
    clearActiveConversation() {
        this.clearConversation()
    }

    /**
     * @deprecated Use setConversation instead
     */
    setActiveConversation(id: string | null) {
        // For backwards compatibility, just clear if null
        if (!id) {
            this.clearConversation()
        }
    }
}

// Singleton instance - only for client
let conversationStore: ConversationStore | null = null

export function getConversationStore(): ConversationStore {
    // Server-side: always create new instance
    if (typeof window === 'undefined') {
        return new ConversationStore()
    }

    // Client-side: use singleton
    if (!conversationStore) {
        conversationStore = new ConversationStore()
    }
    return conversationStore
}
