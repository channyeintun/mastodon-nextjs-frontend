/**
 * Root Store
 * Combines all MobX stores
 */

import { AuthStore } from './authStore'
import { UserStore } from './userStore'
import { UIStore } from './uiStore'

export class RootStore {
  authStore: AuthStore
  userStore: UserStore
  uiStore: UIStore

  constructor() {
    this.authStore = new AuthStore()
    this.userStore = new UserStore()
    this.uiStore = new UIStore()
  }

  // Helper method to reset all stores (e.g., on logout)
  reset() {
    this.authStore.signOut()
    this.userStore.clearUser()
    // UI store preferences are preserved
  }
}

// Singleton instance
let rootStore: RootStore | null = null

export function getRootStore(): RootStore {
  if (!rootStore) {
    rootStore = new RootStore()
  }
  return rootStore
}

export function initRootStore(): RootStore {
  rootStore = new RootStore()
  return rootStore
}
