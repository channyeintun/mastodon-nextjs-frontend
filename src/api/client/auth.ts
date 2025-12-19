/**
 * Authentication API
 */

import { api } from './base'
import type { Application, CreateAppParams, Token } from '../../types/mastodon'

export async function createApp(params: CreateAppParams): Promise<Application> {
    const { data } = await api.post<Application>('/api/v1/apps', params)
    return data
}

export async function getToken(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
): Promise<Token> {
    const formData = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
    })

    const { data } = await api.post<Token>('/oauth/token', formData.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    return data
}
