/**
 * Authentication hook
 * Handles OAuth flow and authentication state
 */

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { observer } from 'mobx-react-lite'
import { useAuthStore } from './useStores'
import { initMastodonClient } from '../api/client'
import {
  normalizeInstanceURL,
  generateAuthorizationURL,
  getRedirectURI,
  getScopes,
  getAppName,
} from '../utils/oauth'

export function useAuth() {
  const authStore = useAuthStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Step 1: Register app with instance and redirect to authorization
   */
  const signIn = async (instanceURL: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Normalize instance URL
      const normalizedURL = normalizeInstanceURL(instanceURL)

      // Initialize client with instance URL
      const client = initMastodonClient(normalizedURL)

      // Store instance URL
      authStore.setInstance(normalizedURL)

      // Create app on the instance
      const app = await client.createApp({
        client_name: getAppName(),
        redirect_uris: getRedirectURI(),
        scopes: getScopes(),
        website: window.location.origin,
      })

      // Store client credentials
      authStore.setClientCredentials(app.client_id, app.client_secret)

      // Generate authorization URL
      const authURL = generateAuthorizationURL(normalizedURL, app.client_id)

      // Redirect to Mastodon authorization page
      window.location.href = authURL
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setIsLoading(false)
    }
  }

  /**
   * Step 2: Exchange authorization code for access token
   */
  const handleCallback = async (code: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { instanceURL, clientId, clientSecret } = authStore.getState()

      if (!instanceURL || !clientId || !clientSecret) {
        throw new Error('Missing authentication state')
      }

      // Initialize client
      const client = initMastodonClient(instanceURL)

      // Exchange code for token
      const token = await client.getToken(
        clientId,
        clientSecret,
        code,
        getRedirectURI(),
      )

      // Store access token
      authStore.setAccessToken(token.access_token)
      client.setAccessToken(token.access_token)

      // Redirect to home
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete sign in')
      setIsLoading(false)
    }
  }

  /**
   * Sign out
   */
  const signOut = () => {
    authStore.signOut()
    navigate({ to: '/auth/signin' })
  }

  return {
    isAuthenticated: authStore.isAuthenticated,
    isLoading,
    error,
    signIn,
    handleCallback,
    signOut,
  }
}
