/**
 * Authentication Store
 * Manages authentication state, tokens, and instance configuration
 */

import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export interface AuthState {
  instanceURL: string | null
  accessToken: string | null
  clientId: string | null
  clientSecret: string | null
  isAuthenticated: boolean
}

export class AuthStore {
  instanceURL: string | null = null
  accessToken: string | null = null
  clientId: string | null = null
  clientSecret: string | null = null

  constructor() {
    makeAutoObservable(this)

    // Persist auth state to localStorage
    if (typeof window !== 'undefined') {
      makePersistable(this, {
        name: 'AuthStore',
        properties: [
          'instanceURL',
          'accessToken',
          'clientId',
          'clientSecret',
        ],
        storage: window.localStorage,
      })
    }
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken && !!this.instanceURL
  }

  setInstance(url: string) {
    this.instanceURL = url.replace(/\/$/, '') // Remove trailing slash
  }

  setCredentials(
    accessToken: string,
    clientId: string,
    clientSecret: string,
  ) {
    this.accessToken = accessToken
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  setClientCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  signOut() {
    this.instanceURL = null
    this.accessToken = null
    this.clientId = null
    this.clientSecret = null
  }

  getState(): AuthState {
    return {
      instanceURL: this.instanceURL,
      accessToken: this.accessToken,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      isAuthenticated: this.isAuthenticated,
    }
  }
}
