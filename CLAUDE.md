# Project: Mastodon (Next.js)

A minimal, performant social media frontend for Mastodon built with Next.js 16 and modern React patterns.

## Project Structure
```
mastodon-nextjs-client/
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── [acct]/           # Account detail pages (/@username or /@username@domain)
│   │   │   └── page.tsx
│   │   ├── auth/             # Authentication routes
│   │   │   ├── callback/     # OAuth callback handler
│   │   │   │   └── page.tsx
│   │   │   └── signin/       # Sign in page
│   │   │       └── page.tsx
│   │   ├── bookmarks/        # Bookmarks page
│   │   │   └── page.tsx
│   │   ├── compose/          # Create post page
│   │   │   └── page.tsx
│   │   ├── search/           # Search page
│   │   │   └── page.tsx
│   │   ├── settings/         # Settings page
│   │   │   └── page.tsx
│   │   ├── status/[id]/      # Status detail pages
│   │   │   └── page.tsx
│   │   ├── tags/[tag]/       # Hashtag feed pages
│   │   │   └── page.tsx
│   │   ├── favicon.ico       # App favicon
│   │   ├── globals.css       # Global styles with Open Props
│   │   ├── layout.tsx        # Root layout with providers
│   │   └── page.tsx          # Home page (timeline)
│   ├── api/                  # Mastodon API client and TanStack Query
│   │   ├── client.ts         # Base API client with fetch wrapper
│   │   ├── queries.ts        # TanStack Query hooks for data fetching
│   │   ├── mutations.ts      # TanStack Query mutations with optimistic updates
│   │   ├── queryKeys.ts      # Query key factory for cache management
│   │   └── index.ts          # API exports
│   ├── components/           # Atomic design components
│   │   ├── atoms/            # Basic UI elements (Button, Input, Avatar, etc.)
│   │   ├── molecules/        # Simple combinations (PostCard, UserCard, etc.)
│   │   ├── organisms/        # Complex components (Timeline, ComposerPanel, etc.)
│   │   ├── templates/        # Page layouts
│   │   └── providers/        # React context providers
│   │       ├── QueryProvider.tsx   # TanStack Query provider
│   │       └── StoreProvider.tsx   # MobX store provider
│   ├── hooks/                # Custom React hooks
│   │   ├── useStores.ts      # MobX store hooks
│   │   ├── useViewTransition.ts  # View Transitions API hook
│   │   └── README.md
│   ├── lib/                  # Library code and extensions
│   │   └── tiptap/           # Tiptap extensions and configurations
│   │       ├── extensions/   # Custom Tiptap extensions
│   │       │   ├── Hashtag.ts          # Hashtag mark with click navigation
│   │       │   ├── CustomEmoji.ts      # Custom Mastodon emoji node
│   │       │   ├── MentionWithClick.ts # Enhanced mention with click navigation
│   │       │   └── ExternalLink.ts     # External link configuration
│   │       └── MentionSuggestion.tsx   # Mention autocomplete UI
│   ├── stores/               # MobX global state stores
│   │   ├── authStore.ts      # Authentication state (tokens, instance URL)
│   │   ├── userStore.ts      # Current user data
│   │   ├── uiStore.ts        # UI state (modals, sidebars, theme)
│   │   ├── rootStore.ts      # Root store combining all stores
│   │   ├── index.ts          # Store exports
│   │   └── README.md
│   ├── types/                # TypeScript type definitions
│   │   ├── mastodon.ts       # Mastodon API types (includes Emoji array in Status)
│   │   └── index.ts          # Type exports
│   └── utils/                # Utility functions
│       ├── oauth.ts          # OAuth helper functions
│       ├── viewTransitions.ts  # View Transitions API helpers
│       └── README.md
├── .git/                     # Git repository
├── .gitignore                # Git ignore rules
├── .next/                    # Next.js build output (gitignored)
├── node_modules/             # Dependencies
├── README.md                 # Project readme
├── CLAUDE.md                 # This file - project structure documentation
├── next-env.d.ts             # Next.js TypeScript declarations
├── next.config.ts            # Next.js configuration (with React Compiler)
├── package.json              # Dependencies and scripts
├── package-lock.json         # Lockfile
├── postcss.config.mjs        # PostCSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Directory Descriptions

### `/src/app/`
Next.js App Router with file-based routing. Each folder with a `page.tsx` becomes a route:
- **Root** (`/`): Home timeline page (shows trending timeline from mastodon.social when not signed in)
- **`/compose`**: Create new post page
- **`/status/[id]`**: Status detail with thread context
- **`/bookmarks`**: Bookmarked posts
- **`/[acct]`**: User profile and posts (accessed via `/@username` or `/@username@domain`, requires @ prefix)
- **`/tags/[tag]`**: Hashtag feed page with infinite scroll (e.g., `/tags/opensource`)
- **`/search`**: Search functionality
- **`/settings`**: Account settings
- **`/auth/signin`**: OAuth sign in
- **`/auth/callback`**: OAuth callback handler

**Special files:**
- `layout.tsx`: Root layout with QueryProvider and StoreProvider
- `globals.css`: Global styles using Open Props

### `/src/api/`
Mastodon API client and TanStack Query integration. Contains:
- **client.ts**: Base HTTP client with authentication and request/response handling
- **queries.ts**: TanStack Query hooks for data fetching (including infinite queries)
- **mutations.ts**: TanStack Query mutations with optimistic updates
- **queryKeys.ts**: Centralized query key factory for consistent caching

### `/src/components/`
Atomic design pattern components:
- **atoms/**: Smallest UI building blocks (Button, Input, Avatar, Card, Icon, Badge, Spinner, Link)
- **molecules/**: Simple component combinations (PostCard, UserCard, SearchBar, Navigation with sidebar/bottom bar layout including logo and auth controls, ActionBar, MediaGallery)
- **organisms/**: Complex components (Timeline, ComposerPanel, ThreadView, ProfileHeader, NavigationWrapper for auth integration)
- **templates/**: Page layouts (MainLayout, AuthLayout, SettingsLayout)
- **providers/**: React context providers for app-wide state

### `/src/hooks/`
Custom React hooks:
- **useStores.ts**: Access MobX stores (useAuthStore, useUserStore, useUIStore)
- **useViewTransition.ts**: View Transitions API wrapper

### `/src/stores/`
MobX stores for global state management:
- **authStore.ts**: Authentication (access token, instance URL, client credentials)
- **userStore.ts**: Current user profile and data
- **uiStore.ts**: UI state (theme, modals, sidebars)
- **rootStore.ts**: Combines all stores into singleton

### `/src/types/`
TypeScript type definitions:
- **mastodon.ts**: Comprehensive types for Mastodon API entities (Status, Account, Context, etc.)

### `/src/utils/`
Utility functions:
- **oauth.ts**: OAuth flow helpers (URL generation, token exchange)
- **viewTransitions.ts**: View Transitions API helpers

## Key Files

### `package.json`
Dependencies and scripts:
- **Main dependencies**: Next.js 16, React 19, TanStack Query, MobX, Motion, Tiptap, Open Props
- **Scripts**:
  - `dev`: Start development server with Turbopack
  - `build`: Build for production
  - `start`: Start production server

### `next.config.ts`
Next.js configuration:
- **reactCompiler: true**: Enables React Compiler for automatic memoization
- Uses Turbopack for fast development builds

### `postcss.config.mjs`
PostCSS configuration:
- postcss-import
- postcss-nesting
- autoprefixer

### `src/app/globals.css`
Global styles using Open Props:
- Open Props imports (style, normalize, buttons)
- Custom CSS properties:
  - `--app-max-width`: Maximum content width (1200px)
  - `--app-sidebar-width`: Desktop sidebar width (280px)
  - `--app-bottom-nav-height`: Mobile bottom navigation height (64px)
- View Transitions CSS
- Utility classes (container, spinner)
- Navigation styles:
  - Sidebar for desktop (full height with header, nav links, footer)
  - Bottom bar for mobile
  - Logo, instance URL, sign in/out buttons
- Responsive breakpoints (768px tablet, 1024px desktop)
- Layout adjustments (body margins/padding for sidebar and bottom nav)

### `tsconfig.json`
TypeScript configuration:
- Path alias: `@/*` → `./src/*`
- Configured for Next.js and React 19