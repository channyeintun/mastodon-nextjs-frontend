# Utils

Utility functions and helpers.

## Files

### Functional Programming
- **`fp.ts`** - Ramda-based functional utilities for data transformation
  - Deduplication helpers (`uniqById`, `flattenAndUniqById`)
  - Nested map helpers (`mapPages`, `mapPagesOptimized`)
  - Status helpers (`findStatusInPages`, `updateStatusById`)
  - See [RAMDA.md](./RAMDA.md) for detailed Ramda functions guide

### Other Utilities
- **`oauth.ts`** - OAuth flow helpers (URL generation, token exchange)
- **`account.ts`** - Account-related utility functions
- **`cookies.ts`** - Cookie management utilities (using native cookieStore API)
- **`tiptapExtensions.ts`** - Tiptap editor extension utilities

## Documentation
- **[RAMDA.md](./RAMDA.md)** - Comprehensive guide to Ramda functions used in this project
