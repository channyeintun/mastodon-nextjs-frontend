# Mastodon Official Frontend Research

This document captures learnings from exploring the official Mastodon JavaScript frontend to identify patterns, features, and APIs that could enhance our Next.js client.

---

## Table of Contents
1. [Compose Feature Architecture](#compose-feature-architecture)
2. [Embedded/Quoted Status](#embeddedquoted-status)
3. [Autosuggest System](#autosuggest-system)
4. [Media Upload with Drag & Drop](#media-upload-with-drag--drop)
5. [Streaming API](#streaming-api)
6. [Notification System v2](#notification-system-v2)
7. [Quote Post System](#quote-post-system)
8. [Account Routing Pattern](#account-routing-pattern-acct--api-by-id)
9. [Missing APIs to Implement](#missing-apis-to-implement)
10. [Recommendations for Our Project](#recommendations-for-our-project)

---

## Compose Feature Architecture

The official Mastodon compose feature (`features/compose/`) is elegantly structured with 20+ specialized components:

### Key Components
| Component | Purpose |
|-----------|---------|
| `compose_form.jsx` | Main form orchestrator with character counting, validation |
| `autosuggest_account.jsx` | Account mention autocomplete |
| `character_counter.tsx` | Live character limit feedback |
| `emoji_picker_dropdown.jsx` | Custom emoji picker with search |
| `language_dropdown.tsx` | Language selection for posts |
| `poll_form.jsx` | Interactive poll creation |
| `poll_button.jsx` | Poll toggle control |
| `privacy_dropdown.tsx` | Visibility selector (public/unlisted/private/direct) |
| `quote_placeholder.tsx` | Quote post placeholder state |
| `quoted_post.tsx` | Embedded quoted post preview |
| `reply_indicator.jsx` | Shows what you're replying to |
| `edit_indicator.jsx` | Shows what you're editing |
| `upload.tsx` | Individual media attachment item |
| `upload_button.jsx` | Media upload trigger |
| `upload_form.tsx` | Media gallery with drag-and-drop reordering |
| `upload_progress.tsx` | Upload progress indicator |
| `visibility_button.tsx` | Compact visibility toggle |
| `warning.tsx` | Content warning/spoiler input |
| `search.tsx` | Search with autosuggest in compose area |

### Beautifully Designed Patterns

**1. Autosuggest Integration**
```javascript
// Mentions (@), hashtags (#), and emojis (:) all use same autosuggest pattern
<AutosuggestTextarea
  suggestions={suggestions}
  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
  onSuggestionSelected={this.onSuggestionSelected}
  searchTokens={['@', '#', ':']}
/>
```

**2. Character Counting with `stringz`**
```javascript
import { length } from 'stringz';
// Uses stringz library for accurate Unicode character counting
// Handles emoji and CJK characters correctly
const fulltext = countableText(text);
```

**3. Keyboard Shortcuts**
- `Ctrl/Cmd + Enter` to submit
- `Escape` to blur
- Arrow keys for suggestion navigation
- `Enter/Tab` to select suggestion

---

## Embedded/Quoted Status

The `status_quoted.tsx` component is a masterclass in handling complex nested content:

### Quote States
```typescript
type ApiQuoteState = 'accepted' | 'pending' | 'revoked' | 'unauthorized';
```

| State | Meaning | UI Behavior |
|-------|---------|-------------|
| `accepted` | Quote approved | Render full quoted post |
| `pending` | Awaiting approval | Show "Post pending" message |
| `revoked` | Author removed permission | Show "Post removed by author" |
| `unauthorized` | Cannot view | Show "Post unavailable" |

### Filtering Scenarios
The component handles multiple filtering cases elegantly:
- **Blocked account**: "Hidden because you've blocked @name"
- **Blocked domain**: "Hidden because you've blocked {domain}"
- **Muted account**: "Hidden because you've muted @name"
- **Limited account**: "Hidden by moderators of {domain}"
- **Filtered content**: "Hidden due to one of your filters"

### Nesting Prevention
```typescript
const MAX_QUOTE_POSTS_NESTING_LEVEL = 1;
// Prevents infinite quote nesting - quotes can only be 1 level deep
// Deeper quotes show as links: "Quoted a post by @name"
```

### Key Feature: State-Aware Rendering
```typescript
const QuotedStatus = ({ quote, nestingLevel }) => {
  // Handles all error states gracefully
  if (quoteError) {
    return <div className='status__quote status__quote--error'>{quoteError}</div>;
  }
  
  // Nested quotes become links at max depth
  if (variant === 'link') {
    return <NestedQuoteLink status={status} />;
  }
  
  // Full quoted post with recursive child quote support
  return (
    <div className='status__quote'>
      <StatusContainer isQuotedPost id={quotedStatusId}>
        {canRenderChildQuote && (
          <QuotedStatus quote={childQuote} nestingLevel={nestingLevel + 1} />
        )}
      </StatusContainer>
    </div>
  );
};
```

---

## Autosuggest System

`autosuggest_textarea.jsx` implements a sophisticated autocomplete:

### Token Detection
```javascript
const textAtCursorMatchesToken = (str, caretPosition) => {
  // Detects @mentions, #hashtags, and :emojis at cursor position
  // Requires minimum 3 characters to trigger
  // Supports both ASCII and full-width characters: @ ＠ # ＃ :
};
```

### Suggestion Types
```javascript
switch (suggestion.type) {
  case 'emoji':   return <AutosuggestEmoji emoji={suggestion} />;
  case 'hashtag': return <AutosuggestHashtag tag={suggestion} />;
  case 'account': return <AutosuggestAccount id={suggestion.id} />;
}
```

### Language-Aware Autocorrect
```javascript
// Hack to force Firefox to change language in autocorrect
useEffect(() => {
  if (lang && textareaRef.current === document.activeElement) {
    textareaRef.current.blur();
    textareaRef.current.focus();
  }
}, [lang]);
```

---

## Media Upload with Drag & Drop

`upload_form.tsx` uses `@dnd-kit` for accessible drag-and-drop:

### Key Features
- **Drag reordering** of multiple attachments
- **Screen reader announcements** for accessibility
- **Keyboard navigation** support
- **Responsive grid layouts** based on media count
- **Upload progress** indicator
- **Processing state** for async media processing

### Accessibility Excellence
```typescript
const accessibility = {
  screenReaderInstructions: {
    draggable: 'To pick up, press space/enter. Arrow keys to move. Space/enter to drop.',
  },
  announcements: {
    onDragStart: 'Picked up media attachment {item}.',
    onDragOver: 'Media attachment {item} was moved.',
    onDragEnd: 'Media attachment {item} was dropped.',
    onDragCancel: 'Dragging cancelled. {item} was dropped.',
  },
};
```

---

## Streaming API

`stream.js` implements WebSocket connection pooling:

### Event Types
```javascript
const KNOWN_EVENT_TYPES = [
  'update',           // New status in timeline
  'delete',           // Status deleted
  'notification',     // New notification
  'conversation',     // DM conversation update
  'filters_changed',  // User's filters changed
  'announcement',     // Server announcement
  'announcement.delete',
  'announcement.reaction',
];
```

### Channel Types
- `user` - Authenticated user's timeline
- `public` - Public timeline
- `public:local` - Local timeline
- `hashtag` - Specific hashtag
- `hashtag:local` - Local hashtag
- `list` - Specific list
- `direct` - Direct messages

### Shared Connection Pattern
```javascript
// Single WebSocket shared across all subscriptions
// Reference counting for subscription management
subscriptionCounters[key] += 1;
// Unsubscribes only when count reaches 0
```

---

## Notification System v2

The v2 notification API provides **grouped notifications** for better UX:

### All Notification Types
```typescript
type NotificationType =
  | 'follow'           // Someone followed you
  | 'follow_request'   // Follow request (locked accounts)
  | 'favourite'        // Status was favourited
  | 'reblog'           // Status was boosted
  | 'mention'          // Mentioned in a post
  | 'quote'            // Your post was quoted
  | 'poll'             // Poll you voted in ended
  | 'status'           // Someone you enabled notifications for posted
  | 'update'           // Post you interacted with was edited
  | 'quoted_update'    // Quote of your post was edited
  | 'admin.sign_up'    // New user signed up (admin)
  | 'admin.report'     // New report (admin)
  | 'moderation_warning'     // You received a moderation warning
  | 'severed_relationships'  // Relationships severed (domain block)
  | 'annual_report';         // Annual wrapped report
```

### Notification Requests System
New API for managing notification filtering:

```typescript
interface NotificationPolicyJSON {
  for_not_following: 'accept' | 'filter' | 'drop';
  for_not_followers: 'accept' | 'filter' | 'drop';
  for_new_accounts: 'accept' | 'filter' | 'drop';
  for_private_mentions: 'accept' | 'filter' | 'drop';
  for_limited_accounts: 'accept' | 'filter' | 'drop';
  summary: {
    pending_requests_count: number;
    pending_notifications_count: number;
  };
}
```

---

## Quote Post System

### Quote Policies
```typescript
type ApiQuotePolicy = 'public' | 'followers' | 'following' | 'nobody';
type ApiUserQuotePolicy = 'automatic' | 'manual' | 'denied' | 'unknown';

interface ApiQuotePolicyJSON {
  automatic: ApiQuotePolicy[];  // Auto-approve for these
  manual: ApiQuotePolicy[];     // Require manual approval
  current_user: ApiUserQuotePolicy;  // Your policy for this post
}
```

### Interaction Policy API
```typescript
// Set who can quote a specific post
PUT /api/v1/statuses/{id}/interaction_policy
{ quote_approval_policy: 'public' | 'followers' | 'nobody' }
```

---

## Account Routing Pattern (/@acct → API by ID)

Mastodon uses `/@acct` URLs for human-readable profile links, but internally fetches data by account ID. Here's how they avoid excessive lookup API calls:

### The `accounts_map` Cache

```typescript
// reducers/accounts_map.ts
// Every time an account is fetched (from ANY API), it's cached:
state[normalizeForLookup(account.acct)] = account.id;
// Result: { "user@example.com": "12345", "localuser": "67890" }
```

### The `useAccountId` Hook

```typescript
// hooks/useAccountId.ts
const { acct, id } = useParams();
const accountId = useAppSelector((state) =>
  id ?? (acct ? state.accounts_map[normalizeForLookup(acct)] : undefined)
);

useEffect(() => {
  // Only calls lookup API if acct NOT in cache
  if (typeof accountId === 'undefined' && acct) {
    dispatch(lookupAccount(acct));  // /api/v1/accounts/lookup
  } else if (accountId && !accountInStore) {
    dispatch(fetchAccount(accountId));  // /api/v1/accounts/:id
  }
}, [dispatch, accountId, acct, accountInStore]);
```

### When Lookup API is Called

| Scenario | API Used | Reason |
|----------|----------|--------|
| Click avatar in timeline | `/api/v1/accounts/:id` | Account already cached from status |
| Navigate to `/@acct` directly | `/api/v1/accounts/lookup` | Account not in cache |
| External link to profile | `/api/v1/accounts/lookup` | Account not in cache |
| Follow link within app | `/api/v1/accounts/:id` | Account cached from previous view |

### Files That Call `lookupAccount`

Only called from `useAccountId` hook, used by:
- `features/account_timeline/index.jsx` - Profile page
- `features/followers/index.jsx` - Followers list
- `features/following/index.jsx` - Following list

### Recommendation for Our Project

Currently we always use lookup API. To optimize:
1. Create an `accountsMap` store that caches `acct` → `id`
2. Populate it whenever accounts are fetched (timelines, notifications, etc.)
3. In `[acct]/page.tsx`, first check the map, then fall back to lookup

---

## Missing APIs to Implement

> [!IMPORTANT]
> These APIs are used by official Mastodon but missing from our client.

### 🔴 High Priority

| API | Endpoint | Purpose | Benefit |
|-----|----------|---------|---------|
| **Translation** | `POST /api/v1/statuses/{id}/translate` | Translate post content | Essential for multilingual users |
| **Announcements** | `GET /api/v1/announcements` | Server announcements | Keep users informed |
| **Announcement Dismiss** | `POST /api/v1/announcements/{id}/dismiss` | Mark as read | Clean up UI |
| **Announcement Reactions** | `PUT/DELETE /api/v1/announcements/{id}/reactions/{name}` | Add/remove emoji reactions | Community engagement |
| **Notification Requests** | `GET /api/v1/notifications/requests` | Filtered notifications | Spam control |
| **Accept/Dismiss Requests** | `POST /api/v1/notifications/requests/{id}/accept` | Handle filtered notifications | Moderation |
| **Notification Policy** | `GET/PUT /api/v1/notifications/policy` | Configure filtering | User preferences |
| **Quote Interaction Policy** | `PUT /api/v1/statuses/{id}/interaction_policy` | Control who can quote | Privacy control |

### 🟡 Medium Priority

| API | Endpoint | Purpose |
|-----|----------|---------|
| **Domain Blocks** | `GET/POST/DELETE /api/v1/domain_blocks` | Block entire domains |
| **Filters** | `GET/POST/PUT/DELETE /api/v2/filters` | Content filtering |
| **Filter Keywords** | Nested in filters | Keyword-based filtering |
| **Featured Tags** | `GET /api/v1/featured_tags` | Profile featured hashtags |
| **Suggestions** | `GET /api/v2/suggestions` | Who to follow suggestions |
| **Familiar Followers** | `GET /api/v1/accounts/familiar_followers` | Mutual connections |
| **Account Notes** | `POST /api/v1/accounts/{id}/note` | Private notes on users |

### 🟢 Nice to Have

| API | Endpoint | Purpose |
|-----|----------|---------|
| **Followed Tags** | `GET /api/v1/followed_tags` | Tags you follow |
| **Tag Follow/Unfollow** | `POST/DELETE /api/v1/tags/{id}/follow` | Follow hashtags |
| **Directory** | `GET /api/v1/directory` | Profile directory |
| **Annual Report** | `GET /api/v1/annual_reports/{year}` | User's annual wrapped |

### ⚙️ Settings & Preferences APIs

| API | Endpoint | Purpose |
|-----|----------|---------|
| **Preferences** | `GET /api/v1/preferences` | User preferences (already have, but verify completeness) |
| **Notification Policy** | `GET/PUT /api/v1/notifications/policy` | Configure notification filtering |
| **Filters v2** | `GET/POST/PUT/DELETE /api/v2/filters` | Content filtering with keywords |
| **Filter Keywords** | `POST/PUT/DELETE /api/v2/filters/{id}/keywords` | Manage filter keywords |
| **Push Subscriptions** | `GET/POST/PUT/DELETE /api/v1/push/subscription` | Web push notifications |
| **Delete Avatar** | `DELETE /api/v1/profile/avatar` | Remove profile avatar |
| **Delete Header** | `DELETE /api/v1/profile/header` | Remove profile header |
| **Remove Suggestion** | `DELETE /api/v1/suggestions/{id}` | Dismiss follow suggestion |

---

## Recommendations for Our Project

### Immediate Actions
1. **Add Translation API** - High user demand
2. **Implement Announcements** - Server communication
3. **Add Notification Requests** - Spam filtering
4. **Add Notification Policy** - User preferences for filtering

### Short-term Improvements
1. **Enhance Compose** with better autosuggest
2. **Add Quote State Handling** - Show pending/revoked states
3. **Implement Drag-and-Drop** for media reordering
4. **Add Filters v2 Support** - Content filtering
5. **Implement `accountsMap` Cache** - Avoid lookup API on every profile visit

### 🎨 UX Polish Tasks

Based on patterns from official Mastodon:

| Task | Description | Reference |
|------|-------------|-----------|
| **Hashtag Autosuggest** | Add #hashtag autocomplete (already have @mention and :emoji) | `autosuggest_textarea.jsx` |
| **Drag-and-Drop Media** | Allow reordering uploaded media attachments | `upload_form.tsx` with `@dnd-kit` |
| **Quote States UI** | Show "Post pending", "Post removed by author", "Post unavailable" states | `status_quoted.tsx` |
| **Character Counter** | Use `stringz` for accurate Unicode/emoji counting | `character_counter.tsx` |
| **Language Selector** | Add language dropdown for multilingual posts | `language_dropdown.tsx` |
| **Reply/Edit Indicators** | Show what you're replying to or editing in compose | `reply_indicator.jsx`, `edit_indicator.jsx` |
| **Keyboard Shortcuts** | `Ctrl+Enter` to submit, `Escape` to blur, arrow keys in suggestions | `compose_form.jsx` |
| **Hover Cards** | Show account preview on hover over avatars/names | `hover_card_account.tsx` |
| **Animated Numbers** | Animate count changes (likes, boosts) | `animated_number.tsx` |
| **Content Warnings** | Improved spoiler/CW input UX | `warning.tsx` |

### ♿ Accessibility Tasks

Patterns from Mastodon's excellent a11y:

| Task | Description | Reference |
|------|-------------|-----------|
| **Screen Reader Announcements** | Announce drag-and-drop actions | `upload_form.tsx` accessibility object |
| **ARIA Labels** | Add `aria-label`, `aria-autocomplete`, `aria-live` regions | Throughout components |
| **Focus Management** | Auto-focus compose after submission, manage focus in modals | `compose_form.jsx` |
| **Keyboard Navigation** | Arrow keys in suggestion lists, Enter/Tab to select | `autosuggest_textarea.jsx` |
| **Language Attribute** | Set `lang` attribute on posts for screen readers | `lang` prop in compose |
| **Alt Text Modal** | Dedicated modal for entering image descriptions | `alt_text_modal/` feature |
| **Skip Links** | Add skip-to-content links for keyboard users | Navigation component |
| **Reduced Motion** | Respect `prefers-reduced-motion` for animations | CSS media queries |
| **High Contrast** | Ensure sufficient color contrast ratios | CSS variables |
| **Button States** | Clear disabled/loading states with visual + text indicators | `Button` component |

---

## Files Referenced

| Purpose | File |
|---------|------|
| Compose Form | `features/compose/components/compose_form.jsx` |
| Quoted Status | `components/status_quoted.tsx` |
| Autosuggest | `components/autosuggest_textarea.jsx` |
| Upload Form | `features/compose/components/upload_form.tsx` |
| Streaming | `stream.js` |
| Status Types | `api_types/statuses.ts` |
| Quote Types | `api_types/quotes.ts` |
| Notification Types | `api_types/notifications.ts` |
| Notification Policy | `api_types/notification_policies.ts` |
| Compose Actions | `actions/compose.js` |
| Status Actions | `actions/statuses.js` |
| Announcements | `actions/announcements.js` |
| Notifications API | `api/notifications.ts` |
