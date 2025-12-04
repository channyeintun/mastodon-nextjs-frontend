/**
 * View Transitions API utilities
 * https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

/**
 * Check if View Transitions API is supported
 */
export function isViewTransitionSupported(): boolean {
  return (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof (document as any).startViewTransition === 'function'
  )
}

/**
 * Wrap a DOM update in a view transition
 * Falls back to immediate execution if not supported
 */
export function withViewTransition(updateCallback: () => void | Promise<void>) {
  if (!isViewTransitionSupported()) {
    return updateCallback()
  }

  return (document as any).startViewTransition(updateCallback)
}

/**
 * Create a named view transition
 * Useful for custom transitions between specific elements
 */
export function setViewTransitionName(
  element: HTMLElement | null,
  name: string,
) {
  if (element) {
    element.style.viewTransitionName = name
  }
}

/**
 * Remove view transition name from element
 */
export function removeViewTransitionName(element: HTMLElement | null) {
  if (element) {
    element.style.viewTransitionName = ''
  }
}
