import { useCallback } from 'react'
import { withViewTransition } from '../utils/viewTransitions'

/**
 * Hook to wrap state updates in view transitions
 */
export function useViewTransition() {
  const transition = useCallback(
    (updateCallback: () => void | Promise<void>) => {
      return withViewTransition(updateCallback)
    },
    [],
  )

  return transition
}
