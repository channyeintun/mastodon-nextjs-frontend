# Ramda Functions Guide

This guide explains the Ramda functions used in this project. Ramda is a functional programming library for JavaScript that emphasizes immutability and side-effect-free functions.

## Table of Contents
- [Core Concepts](#core-concepts)
- [Composition Functions](#composition-functions)
- [Array Functions](#array-functions)
- [Object Functions](#object-functions)
- [Logic Functions](#logic-functions)
- [Utility Functions](#utility-functions)
- [Real-World Examples](#real-world-examples)

---

## Core Concepts

### Function Composition
Ramda functions are automatically curried, meaning they can be partially applied. This allows for powerful function composition.

```javascript
// Currying example
const add = (a, b) => a + b
const add5 = add(5)  // Partial application
add5(10) // 15

// Ramda functions work the same way
const getIds = map(prop('id'))
const statusIds = getIds(statuses)
```

---

## Composition Functions

### `pipe(...functions)`
Performs left-to-right function composition. The result of one function is passed to the next.

```javascript
import { pipe, map, filter, flatten } from 'ramda'

// Process data through multiple transformations
const processStatuses = pipe(
  flatten,                    // 1. Flatten nested arrays
  filter(s => !s.muted),     // 2. Remove muted statuses
  map(s => s.id)             // 3. Extract IDs
)

const pages = [[status1, status2], [status3, status4]]
const ids = processStatuses(pages)
// Result: ['1', '2', '3', '4']
```

**Use case in codebase:** Combining data transformations in `fp.ts` utilities

---

## Array Functions

### `map(fn, array)`
Transforms each element in an array using the provided function.

```javascript
import { map } from 'ramda'

const statuses = [
  { id: '1', content: 'Hello' },
  { id: '2', content: 'World' }
]

// Extract all IDs
const ids = map(s => s.id, statuses)
// Result: ['1', '2']

// Can be curried
const getContent = map(s => s.content)
const contents = getContent(statuses)
// Result: ['Hello', 'World']
```

**Use case in codebase:** `mapPages()` in `fp.ts` for updating nested status arrays

---

### `filter(predicate, array)`
Returns a new array containing only elements that satisfy the predicate.

```javascript
import { filter } from 'ramda'

const statuses = [
  { id: '1', favourited: true },
  { id: '2', favourited: false },
  { id: '3', favourited: true }
]

// Get only favourited statuses
const favourited = filter(s => s.favourited, statuses)
// Result: [{ id: '1', ... }, { id: '3', ... }]
```

**Use case in codebase:** Filtering out nil values, muted content, etc.

---

### `reject(predicate, array)`
Opposite of `filter` - returns elements that DON'T satisfy the predicate.

```javascript
import { reject, isNil } from 'ramda'

const values = [1, null, 2, undefined, 3]

// Remove null/undefined values
const compact = reject(isNil, values)
// Result: [1, 2, 3]
```

**Use case in codebase:** `compact()` function in `fp.ts` to remove nil values

---

### `flatten(array)`
Flattens a nested array structure by one level.

```javascript
import { flatten } from 'ramda'

const pages = [
  [{ id: '1' }, { id: '2' }],
  [{ id: '3' }, { id: '4' }]
]

const flat = flatten(pages)
// Result: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]
```

**Use case in codebase:** `flattenPages()` in `fp.ts` for processing InfiniteData results

---

### `uniqBy(fn, array)`
Returns a new array containing only unique elements based on the function's return value.

```javascript
import { uniqBy } from 'ramda'

const statuses = [
  { id: '1', content: 'A' },
  { id: '2', content: 'B' },
  { id: '1', content: 'A (duplicate)' }
]

// Remove duplicates by ID
const unique = uniqBy(s => s.id, statuses)
// Result: [{ id: '1', ... }, { id: '2', ... }]

// Common pattern: uniqBy(prop('id'))
const uniqueById = uniqBy(prop('id'), statuses)
```

**Use case in codebase:** `uniqById()` in `fp.ts` for deduplicating paginated results

---

### `find(predicate, array)`
Returns the first element that satisfies the predicate.

```javascript
import { find } from 'ramda'

const statuses = [
  { id: '1', pinned: false },
  { id: '2', pinned: true },
  { id: '3', pinned: false }
]

// Find first pinned status
const pinned = find(s => s.pinned, statuses)
// Result: { id: '2', pinned: true }

// Returns undefined if not found
const notFound = find(s => s.id === '99', statuses)
// Result: undefined
```

**Use case in codebase:** `findStatusInArray()` and `findFirstNonNil()` in `fp.ts`

---

### `chain(fn, array)`
Maps a function over a list and concatenates the results. Also known as `flatMap`.

```javascript
import { chain } from 'ramda'

const users = [
  { name: 'Alice', posts: [{ id: '1' }, { id: '2' }] },
  { name: 'Bob', posts: [{ id: '3' }] }
]

// Get all posts from all users (flattened)
const allPosts = chain(u => u.posts, users)
// Result: [{ id: '1' }, { id: '2' }, { id: '3' }]

// Equivalent to:
// users.flatMap(u => u.posts)
```

**Use case in codebase:** Available for complex data transformations

---

## Object Functions

### `prop(key, object)`
Returns the value of a property from an object.

```javascript
import { prop } from 'ramda'

const status = { id: '123', content: 'Hello', favourited: true }

// Get a property
const id = prop('id', status)
// Result: '123'

// Very useful when curried
const getId = prop('id')
const ids = map(getId, statuses)

// Works with map
const getIds = map(prop('id'))
```

**Use case in codebase:** Extracting properties throughout the codebase, especially in `getMatchingStatus()`

---

## Logic Functions

### `cond(pairs)`
Returns a function that evaluates conditions from top to bottom and returns the result of the first truthy condition.

```javascript
import { cond, T } from 'ramda'

const getStatusType = cond([
  [s => s.reblog, () => 'reblog'],
  [s => s.in_reply_to_id, () => 'reply'],
  [s => s.poll, () => 'poll'],
  [T, () => 'regular']  // T is always true (default case)
])

getStatusType({ reblog: {...} })  // 'reblog'
getStatusType({ in_reply_to_id: '123' })  // 'reply'
getStatusType({ content: 'Hi' })  // 'regular'
```

**Real example from codebase:**
```javascript
// From fp.ts - updateStatusById
export const updateStatusById = (statusId: string, updateFn: (status: Status) => Status) =>
  (status: Status): Status =>
    cond([
      // If this status matches, update it
      [(s: Status) => s.id === statusId, updateFn],
      // If this is a reblog and the reblogged status matches, update the reblog
      [
        (s: Status) => Boolean(s.reblog && s.reblog.id === statusId),
        (s: Status) => ({ ...s, reblog: updateFn(s.reblog!) })
      ],
      // No match, return unchanged
      [T, identity]
    ])(status)
```

**Use case in codebase:** `updateStatusById()` and `getMatchingStatus()` in `fp.ts`

---

### `T`
A function that always returns `true`. Used as a default case in `cond`.

```javascript
import { cond, T } from 'ramda'

const categorize = cond([
  [x => x < 0, () => 'negative'],
  [x => x === 0, () => 'zero'],
  [T, () => 'positive']  // Matches everything else
])

categorize(-5)  // 'negative'
categorize(0)   // 'zero'
categorize(10)  // 'positive'
```

---

### `complement(fn)`
Returns a function that returns the opposite boolean value.

```javascript
import { complement, isNil } from 'ramda'

// isNil checks if value is null or undefined
isNil(null)      // true
isNil(undefined) // true
isNil(0)         // false

// Create the opposite
const isNotNil = complement(isNil)
isNotNil(null)      // false
isNotNil(undefined) // false
isNotNil(0)         // true
```

**Use case in codebase:** `isNotNil` in `fp.ts` for filtering valid values

---

## Utility Functions

### `identity(x)`
Returns the value passed to it. Useful for composition and as a default transformer.

```javascript
import { identity } from 'ramda'

identity(5)       // 5
identity('hello') // 'hello'
identity({ a: 1 }) // { a: 1 }

// Useful in conditionals
const process = cond([
  [isSpecial, transformSpecial],
  [T, identity]  // Do nothing for regular items
])
```

**Use case in codebase:** Default case in `cond` expressions in `fp.ts`

---

### `isNil(value)`
Returns `true` if the value is `null` or `undefined`.

```javascript
import { isNil } from 'ramda'

isNil(null)      // true
isNil(undefined) // true
isNil(0)         // false
isNil('')        // false
isNil(false)     // false
```

**Use case in codebase:** Checking for null/undefined in data validation

---

### `defaultTo(default, value)`
Returns the value if it's not `null`, `undefined`, or `NaN`. Otherwise returns the default.

```javascript
import { defaultTo } from 'ramda'

defaultTo(0, null)      // 0
defaultTo(0, undefined) // 0
defaultTo(0, NaN)       // 0
defaultTo(0, 5)         // 5
defaultTo(0, '')        // ''
defaultTo(0, false)     // false

// Useful for config with fallbacks
const getConfig = pipe(
  prop('maxItems'),
  defaultTo(10)
)
```

**Use case in codebase:** Providing fallback values in data processing

---

## Real-World Examples

### Example 1: Flattening and Deduplicating Paginated Data

```javascript
import { pipe, flatten, uniqBy, prop } from 'ramda'

// InfiniteQuery returns: { pages: [[item1, item2], [item3, item4]] }
const processInfiniteData = pipe(
  prop('pages'),           // Extract pages array
  flatten,                 // Flatten to single array
  uniqBy(prop('id'))      // Remove duplicates by ID
)

const infiniteData = {
  pages: [
    [{ id: '1', name: 'A' }, { id: '2', name: 'B' }],
    [{ id: '3', name: 'C' }, { id: '1', name: 'A' }]  // duplicate
  ]
}

const unique = processInfiniteData(infiniteData)
// Result: [{ id: '1', ... }, { id: '2', ... }, { id: '3', ... }]
```

---

### Example 2: Filtering and Transforming Statuses

```javascript
import { pipe, filter, reject, isNil, map, prop } from 'ramda'

const processStatuses = pipe(
  reject(isNil),                    // Remove null/undefined
  filter(s => !s.muted),            // Remove muted
  filter(s => s.visibility !== 'direct'),  // Remove direct messages
  map(prop('id'))                   // Extract IDs
)

const statuses = [
  { id: '1', muted: false, visibility: 'public' },
  null,
  { id: '2', muted: true, visibility: 'public' },
  { id: '3', muted: false, visibility: 'direct' },
  { id: '4', muted: false, visibility: 'public' }
]

const ids = processStatuses(statuses)
// Result: ['1', '4']
```

---

### Example 3: Nested Array Updates (from `mutations.ts`)

```javascript
import { map } from 'ramda'

// Update a status in nested pages
const mapPages = (updateFn) => map(map(updateFn))

const pages = [
  [{ id: '1', favourited: false }, { id: '2', favourited: false }],
  [{ id: '3', favourited: false }, { id: '4', favourited: false }]
]

const favouriteStatus = (status) =>
  status.id === '2'
    ? { ...status, favourited: true }
    : status

const updatedPages = mapPages(favouriteStatus)(pages)
// Result: pages[0][1].favourited is now true
```

---

### Example 4: Finding First Non-Nil Value

```javascript
import { find, complement, isNil } from 'ramda'

const isNotNil = complement(isNil)

const findFirstNonNil = find(isNotNil)

const values = [null, undefined, null, 'found!', 'also valid']
const result = findFirstNonNil(values)
// Result: 'found!'
```

**Real use case from `mutations.ts`:**
```javascript
// Try finding status in multiple caches
const foundInTimelines = findFirstNonNil(
  timelines.map(([_, data]) => findStatusInPages(statusId)(data?.pages))
)
```

---

### Example 5: Conditional Updates with `cond`

```javascript
import { cond, T } from 'ramda'

// Update different status types differently
const updateStatus = cond([
  // Reblog - update nested reblog
  [
    s => s.reblog?.id === statusId,
    s => ({ ...s, reblog: { ...s.reblog, favourited: true } })
  ],
  // Direct match - update status
  [
    s => s.id === statusId,
    s => ({ ...s, favourited: true })
  ],
  // No match - return unchanged
  [T, s => s]
])
```

---

## Best Practices

### 1. Use Currying for Reusable Functions
```javascript
// Good - reusable
const getIds = map(prop('id'))
const statusIds = getIds(statuses)
const accountIds = getIds(accounts)

// Less ideal - repeated logic
const statusIds = statuses.map(s => s.id)
const accountIds = accounts.map(a => a.id)
```

### 2. Compose Small Functions
```javascript
// Good - composable
const isValid = s => !s.muted && s.visibility === 'public'
const getValidIds = pipe(
  filter(isValid),
  map(prop('id'))
)

// Less ideal - all in one
const getValidIds = statuses =>
  statuses.filter(s => !s.muted && s.visibility === 'public').map(s => s.id)
```

### 3. Leverage Point-Free Style
```javascript
// Point-free (no explicit parameters)
const getIds = map(prop('id'))

// Pointed (explicit parameters)
const getIds = (arr) => map(prop('id'), arr)

// Both work, but point-free is more concise
```

---

## Resources

- [Ramda Documentation](https://ramdajs.com/)
- [Ramda REPL](https://ramdajs.com/repl/)
- [Thinking in Ramda](https://randycoulman.com/blog/categories/thinking-in-ramda/)

---

## Quick Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `pipe` | Compose functions left-to-right | `pipe(f, g, h)(x)` |
| `map` | Transform array elements | `map(f, arr)` |
| `filter` | Keep matching elements | `filter(pred, arr)` |
| `reject` | Remove matching elements | `reject(pred, arr)` |
| `flatten` | Flatten nested arrays | `flatten([[1], [2]])` |
| `uniqBy` | Remove duplicates by key | `uniqBy(prop('id'), arr)` |
| `find` | Find first match | `find(pred, arr)` |
| `prop` | Get object property | `prop('id', obj)` |
| `cond` | Conditional logic | `cond([[pred, fn], ...])` |
| `identity` | Return input unchanged | `identity(x)` |
| `isNil` | Check for null/undefined | `isNil(null)` |
| `complement` | Negate predicate | `complement(isNil)` |
| `defaultTo` | Provide fallback value | `defaultTo(0, val)` |
| `T` | Always true | Used in `cond` |
| `chain` | FlatMap over array | `chain(f, arr)` |
