# Mastodon API Comprehensive Summary

Based on the official Mastodon API documentation at https://docs.joinmastodon.org/api/

## 1. Authentication (OAuth 2.0 Flow)

### Step 1: Create Application
**Endpoint:** `POST /api/v1/apps`
**HTTP Method:** POST
**Authentication:** None required

**Request Parameters:**
- `client_name` (required, string): Application name
- `redirect_uris` (required, string): Space-separated redirect URIs or `urn:ietf:wg:oauth:2.0:oob` for out-of-band
- `scopes` (optional, string): Space-separated OAuth scopes (defaults to `read`)
- `website` (optional, string): Application homepage URL

**Response Fields:**
```typescript
{
  id: string;
  client_id: string;
  client_secret: string;
  client_secret_expires_at: number; // Usually 0 (no expiration)
  scopes: string[];
  redirect_uris: string[];
}
```

### Step 2: Authorization Code
**Endpoint:** `GET /oauth/authorize`
User redirected to: `{redirect_uri}?code={authorization_code}&state={state}`

### Step 3: Exchange Code for Token
**Endpoint:** `POST /oauth/token`
**Response:** `access_token`, `token_type: "Bearer"`

### OAuth Scopes
- `profile`: Minimal user info
- `read`: Read access (accounts, statuses, lists, bookmarks, search)
- `write`: Write access (accounts, statuses, follows, bookmarks, favourites)
- `push`: Push notifications

## 2. Timelines

### Home Timeline
**Endpoint:** `GET /api/v1/timelines/home`
**Auth Required:** Yes (`read:statuses`)
**Params:** `max_id`, `since_id`, `min_id`, `limit` (max: 40)

### Public Timeline
**Endpoint:** `GET /api/v1/timelines/public`
**Auth:** Optional
**Params:** `local`, `remote`, `only_media`, pagination

## 3. Statuses

### Get Status
`GET /api/v1/statuses/:id`

### Create Status
`POST /api/v1/statuses`
**Params:** `status`, `media_ids[]`, `poll`, `in_reply_to_id`, `sensitive`, `spoiler_text`, `visibility`

### Get Context (Thread)
`GET /api/v1/statuses/:id/context`
**Returns:** `{ ancestors: Status[], descendants: Status[] }`

### Bookmark/Unbookmark
`POST /api/v1/statuses/:id/bookmark`
`POST /api/v1/statuses/:id/unbookmark`

### Favorite/Unfavorite
`POST /api/v1/statuses/:id/favourite`
`POST /api/v1/statuses/:id/unfavourite`

### Boost/Unboost
`POST /api/v1/statuses/:id/reblog`
`POST /api/v1/statuses/:id/unreblog`

## 4. Accounts

### Get Account
`GET /api/v1/accounts/:id`

### Verify Credentials
`GET /api/v1/accounts/verify_credentials` (Current user)

### Get Account Statuses
`GET /api/v1/accounts/:id/statuses`
**Params:** `only_media`, `exclude_replies`, `exclude_reblogs`, `pinned`, `tagged`

### Follow/Unfollow
`POST /api/v1/accounts/:id/follow`
`POST /api/v1/accounts/:id/unfollow`

### Get Followers/Following
`GET /api/v1/accounts/:id/followers`
`GET /api/v1/accounts/:id/following`

## 5. Search

### Search v2
`GET /api/v2/search`
**Params:** `q` (required), `type` (accounts/statuses/hashtags), `resolve`, `following`
**Returns:** `{ accounts: Account[], statuses: Status[], hashtags: Tag[] }`

## 6. Bookmarks

### List Bookmarks
`GET /api/v1/bookmarks`
**Auth Required:** Yes (`read:bookmarks`)
**Params:** Pagination (`max_id`, `since_id`, `min_id`, `limit`)

## Key Entity Structures

### Status
```typescript
interface Status {
  id: string;
  uri: string;
  url: string | null;
  created_at: string;
  edited_at: string | null;
  content: string; // HTML
  text: string | null; // Plain text
  spoiler_text: string;
  visibility: 'public' | 'unlisted' | 'private' | 'direct';
  sensitive: boolean;
  account: Account;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  media_attachments: MediaAttachment[];
  poll: Poll | null;
  in_reply_to_id: string | null;
  reblog: Status | null;
  favourited?: boolean;
  reblogged?: boolean;
  bookmarked?: boolean;
}
```

### Account
```typescript
interface Account {
  id: string;
  username: string;
  acct: string; // username@domain
  url: string;
  display_name: string;
  note: string; // HTML bio
  avatar: string;
  header: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  locked: boolean;
  bot: boolean;
  created_at: string;
  fields: Field[];
}
```

### Context
```typescript
interface Context {
  ancestors: Status[];
  descendants: Status[];
}
```

## Implementation Notes

- **Base URL:** `https://{instance}/api/v1/...`
- **Auth Header:** `Authorization: Bearer {access_token}`
- **Pagination:** Use `max_id` for older, `min_id` for newer
- **Rate Limiting:** Check response headers
- **Default Limit:** 20, Max: 40
