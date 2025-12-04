/**
 * User Store
 * Manages current user data and profile information
 */

import { makeAutoObservable } from 'mobx'
import type { Account } from '../types/mastodon'

export class UserStore {
  currentUser: Account | null = null
  isLoadingUser = false
  userError: Error | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setCurrentUser(user: Account) {
    this.currentUser = user
    this.userError = null
  }

  setLoadingUser(loading: boolean) {
    this.isLoadingUser = loading
  }

  setUserError(error: Error) {
    this.userError = error
    this.isLoadingUser = false
  }

  clearUser() {
    this.currentUser = null
    this.isLoadingUser = false
    this.userError = null
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser
  }

  get username(): string | null {
    return this.currentUser?.username ?? null
  }

  get displayName(): string | null {
    return this.currentUser?.display_name ?? null
  }

  get avatar(): string | null {
    return this.currentUser?.avatar ?? null
  }
}
