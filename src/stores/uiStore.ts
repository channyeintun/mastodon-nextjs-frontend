/**
 * UI Store
 * Manages UI state like modals, sidebars, theme, etc.
 */

import { makeAutoObservable } from 'mobx'
import { makePersistable } from 'mobx-persist-store'

export type Theme = 'light' | 'dark' | 'auto'

export class UIStore {
  theme: Theme = 'auto'
  isSidebarOpen = false
  isComposeModalOpen = false
  currentModal: string | null = null

  constructor() {
    makeAutoObservable(this)

    // Persist UI preferences
    if (typeof window !== 'undefined') {
      makePersistable(this, {
        name: 'UIStore',
        properties: ['theme'],
        storage: window.localStorage,
      })
    }
  }

  setTheme(theme: Theme) {
    this.theme = theme
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen
  }

  openSidebar() {
    this.isSidebarOpen = true
  }

  closeSidebar() {
    this.isSidebarOpen = false
  }

  openComposeModal() {
    this.isComposeModalOpen = true
  }

  closeComposeModal() {
    this.isComposeModalOpen = false
  }

  openModal(modalName: string) {
    this.currentModal = modalName
  }

  closeModal() {
    this.currentModal = null
  }

  get activeTheme(): 'light' | 'dark' {
    if (this.theme === 'auto') {
      // Check system preference
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return 'light'
    }
    return this.theme
  }
}
