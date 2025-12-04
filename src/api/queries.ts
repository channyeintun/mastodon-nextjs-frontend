/**
 * TanStack Query hooks for fetching Mastodon data
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getMastodonClient } from './client'
import { queryKeys } from './queryKeys'
import type { TimelineParams, SearchParams } from '../types/mastodon'

// Timelines
export function useHomeTimeline(params?: TimelineParams) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.timelines.home(params),
    queryFn: () => client.getHomeTimeline(params),
  })
}

export function useInfiniteHomeTimeline() {
  const client = getMastodonClient()

  return useInfiniteQuery({
    queryKey: queryKeys.timelines.home(),
    queryFn: ({ pageParam }) =>
      client.getHomeTimeline({ max_id: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined
      return lastPage[lastPage.length - 1]?.id
    },
    initialPageParam: undefined as string | undefined,
  })
}

export function usePublicTimeline(params?: TimelineParams) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.timelines.public(params),
    queryFn: () => client.getPublicTimeline(params),
  })
}

// Statuses
export function useStatus(id: string) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.statuses.detail(id),
    queryFn: () => client.getStatus(id),
    enabled: !!id,
  })
}

export function useStatusContext(id: string) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.statuses.context(id),
    queryFn: () => client.getStatusContext(id),
    enabled: !!id,
  })
}

// Accounts
export function useAccount(id: string) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => client.getAccount(id),
    enabled: !!id,
  })
}

export function useCurrentAccount() {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.current(),
    queryFn: () => client.verifyCredentials(),
  })
}

export function useAccountStatuses(id: string, params?: TimelineParams) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.statuses(id, params),
    queryFn: () => client.getAccountStatuses(id, params),
    enabled: !!id,
  })
}

export function useInfiniteAccountStatuses(id: string) {
  const client = getMastodonClient()

  return useInfiniteQuery({
    queryKey: queryKeys.accounts.statuses(id),
    queryFn: ({ pageParam }) =>
      client.getAccountStatuses(id, { max_id: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined
      return lastPage[lastPage.length - 1]?.id
    },
    initialPageParam: undefined as string | undefined,
    enabled: !!id,
  })
}

export function useFollowers(id: string) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.followers(id),
    queryFn: () => client.getFollowers(id),
    enabled: !!id,
  })
}

export function useFollowing(id: string) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.following(id),
    queryFn: () => client.getFollowing(id),
    enabled: !!id,
  })
}

export function useRelationships(ids: string[]) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.accounts.relationships(ids),
    queryFn: () => client.getRelationships(ids),
    enabled: ids.length > 0,
  })
}

// Bookmarks
export function useBookmarks(params?: TimelineParams) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.bookmarks.all(params),
    queryFn: () => client.getBookmarks(params),
  })
}

export function useInfiniteBookmarks() {
  const client = getMastodonClient()

  return useInfiniteQuery({
    queryKey: queryKeys.bookmarks.all(),
    queryFn: ({ pageParam }) =>
      client.getBookmarks({ max_id: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined
      return lastPage[lastPage.length - 1]?.id
    },
    initialPageParam: undefined as string | undefined,
  })
}

// Search
export function useSearch(params: SearchParams) {
  const client = getMastodonClient()

  return useQuery({
    queryKey: queryKeys.search.all(params.q, params.type),
    queryFn: () => client.search(params),
    enabled: !!params.q && params.q.trim().length > 0,
  })
}
