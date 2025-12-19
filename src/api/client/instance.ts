/**
 * Instance API
 */

import { api } from './base'
import type {
    Instance,
    Preferences,
    Language,
    Rule,
    PrivacyPolicy,
    TermsOfService,
    ExtendedDescription
} from '../../types/mastodon'

export async function getInstance(signal?: AbortSignal): Promise<Instance> {
    const { data } = await api.get<Instance>('/api/v2/instance', { signal })
    return data
}

export async function getPreferences(signal?: AbortSignal): Promise<Preferences> {
    const { data } = await api.get<Preferences>('/api/v1/preferences', { signal })
    return data
}

export async function getInstanceLanguages(signal?: AbortSignal): Promise<Language[]> {
    const { data } = await api.get<Language[]>('/api/v1/instance/languages', { signal })
    return data
}

export async function getInstanceRules(signal?: AbortSignal): Promise<Rule[]> {
    const { data } = await api.get<Rule[]>('/api/v1/instance/rules', { signal })
    return data
}

export async function getPrivacyPolicy(signal?: AbortSignal): Promise<PrivacyPolicy> {
    const { data } = await api.get<PrivacyPolicy>('/api/v1/instance/privacy_policy', { signal })
    return data
}

export async function getTermsOfService(signal?: AbortSignal): Promise<TermsOfService> {
    const { data } = await api.get<TermsOfService>('/api/v1/instance/terms_of_service', { signal })
    return data
}

export async function getExtendedDescription(signal?: AbortSignal): Promise<ExtendedDescription> {
    const { data } = await api.get<ExtendedDescription>('/api/v1/instance/extended_description', { signal })
    return data
}

// Translation Languages - returns a map of source language -> array of target languages
export type TranslationLanguagesMap = Record<string, string[]>

export async function getTranslationLanguages(signal?: AbortSignal): Promise<TranslationLanguagesMap> {
    const { data } = await api.get<TranslationLanguagesMap>('/api/v1/instance/translation_languages', { signal })
    return data
}
