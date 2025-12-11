/**
 * Functional Programming utilities using Ramda
 * Reusable combinators for common data transformation patterns
 */

import { pipe, map, flatten, uniqBy, prop, filter, reject, isNil, defaultTo } from 'ramda'
import type { Status, Tag, TrendingLink } from '@/types'

// ============================================================================
// DEDUPLICATION HELPERS
// ============================================================================

/**
 * Deduplicate items by their 'id' property
 */
export const uniqById = <T extends { id: string }>(items: T[]): T[] =>
    uniqBy((item: T) => item.id, items)

/**
 * Deduplicate items by a specific key
 */
export const uniqByKey = <T>(key: keyof T) =>
    (items: T[]): T[] => uniqBy((item: T) => item[key], items)

/**
 * Flatten paginated data and deduplicate by ID
 * Common pattern for infinite query results
 */
export const flattenAndUniqById = <T extends { id: string }>(pages: T[][] | undefined): T[] => {
    const flattened = pages ? flatten(pages) : []
    return uniqBy((item: T) => item.id, flattened)
}

/**
 * Flatten paginated data and deduplicate by a specific key
 */
export const flattenAndUniqByKey = <T>(key: keyof T) =>
    (pages: T[][] | undefined): T[] => {
        const flattened = pages ? flatten(pages) : []
        return uniqBy((item: T) => item[key], flattened)
    }

/**
 * Flatten paginated data without deduplication
 * Use when data doesn't need deduplication (e.g., accounts, notifications)
 */
export const flattenPages = <T>(pages: T[][] | undefined): T[] =>
    pages ? (flatten(pages) as unknown as T[]) : []

// ============================================================================
// NESTED MAP HELPERS (for cache updates)
// ============================================================================

/**
 * Map over nested pages structure (InfiniteData pattern)
 * Useful for updating statuses in paginated caches
 */
export const mapPages = <T>(fn: (item: T) => T) =>
    (pages: T[][]): T[][] => map(map(fn), pages)

/**
 * Map over pages with early return optimization
 * Only creates new arrays if the item changes
 */
export const mapPagesOptimized = <T>(fn: (item: T) => T) =>
    (pages: T[][]): T[][] =>
        pages.map(page => {
            let changed = false
            const newPage = page.map(item => {
                const result = fn(item)
                if (result !== item) changed = true
                return result
            })
            return changed ? newPage : page
        })

// ============================================================================
// FILTER HELPERS
// ============================================================================

/**
 * Filter out null/undefined values
 */
export const compact = <T>(items: (T | null | undefined)[]): T[] =>
    reject(isNil, items) as T[]

/**
 * Remove items matching a predicate
 */
export { reject }

// ============================================================================
// PROP ACCESS HELPERS
// ============================================================================

export { prop, map, filter, pipe, flatten, uniqBy, defaultTo }
