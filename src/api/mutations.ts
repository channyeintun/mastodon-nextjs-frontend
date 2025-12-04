/**
 * TanStack Query mutations for Mastodon data updates
 * Includes optimistic updates for better UX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMastodonClient } from './client'
import { queryKeys } from './queryKeys'
import type { CreateStatusParams, Status } from '../types/mastodon'

// Status mutations
export function useCreateStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateStatusParams) => client.createStatus(params),
    onSuccess: () => {
      // Invalidate home timeline to fetch new post
      queryClient.invalidateQueries({ queryKey: queryKeys.timelines.home() })
    },
  })
}

export function useDeleteStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.deleteStatus(id),
    onSuccess: (_data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.statuses.detail(id) })
      // Invalidate timelines
      queryClient.invalidateQueries({ queryKey: queryKeys.timelines.all })
    },
  })
}

export function useFavouriteStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.favouriteStatus(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      // Snapshot previous value
      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      // Optimistically update
      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          favourited: true,
          favourites_count: previous.favourites_count + 1,
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
    },
  })
}

export function useUnfavouriteStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.unfavouriteStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          favourited: false,
          favourites_count: Math.max(0, previous.favourites_count - 1),
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
    },
  })
}

export function useReblogStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.reblogStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          reblogged: true,
          reblogs_count: previous.reblogs_count + 1,
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
    },
  })
}

export function useUnreblogStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.unreblogStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          reblogged: false,
          reblogs_count: Math.max(0, previous.reblogs_count - 1),
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
    },
  })
}

export function useBookmarkStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.bookmarkStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          bookmarked: true,
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all() })
    },
  })
}

export function useUnbookmarkStatus() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.unbookmarkStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.statuses.detail(id) })

      const previous = queryClient.getQueryData<Status>(
        queryKeys.statuses.detail(id),
      )

      if (previous) {
        queryClient.setQueryData<Status>(queryKeys.statuses.detail(id), {
          ...previous,
          bookmarked: false,
        })
      }

      return { previous, id }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.statuses.detail(context.id),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all() })
    },
  })
}

// Account mutations
export function useFollowAccount() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.followAccount(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.detail(id) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.relationships([id]),
      })
    },
  })
}

export function useUnfollowAccount() {
  const client = getMastodonClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => client.unfollowAccount(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.detail(id) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.relationships([id]),
      })
    },
  })
}
