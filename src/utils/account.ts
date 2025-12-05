/**
 * Formats an account handle for display
 * @param acct - The account's acct field (username or username@domain)
 * @returns Formatted handle with @ prefix
 *
 * Examples:
 * - Local account: "channyeintun" → "@channyeintun"
 * - Remote account: "channyeintun@mastodon.beer" → "@channyeintun@mastodon.beer"
 */
export function formatAccountHandle(acct: string): string {
  return `@${acct}`;
}

/**
 * Checks if an account is from a remote instance
 * @param acct - The account's acct field
 * @returns true if account is remote (contains @domain)
 */
export function isRemoteAccount(acct: string): boolean {
  return acct.includes('@');
}
