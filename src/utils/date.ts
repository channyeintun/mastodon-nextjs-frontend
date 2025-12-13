/**
 * Date utility functions using date-fns
 *
 * Centralizes all date formatting and manipulation to:
 * - Eliminate duplicate implementations across components
 * - Provide consistent date formatting throughout the app
 * - Make date operations more readable and maintainable
 */

import {
  formatDistanceToNowStrict,
  formatDistanceToNow,
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from 'date-fns';

/**
 * Format a date string to a short relative time format (e.g., "5s", "10m", "2h", "3d")
 * Falls back to "MMM d" format (e.g., "Dec 14") after 7 days
 *
 * @param dateString - ISO date string
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInSeconds = differenceInSeconds(now, date);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${differenceInMinutes(now, date)}m`;
  if (diffInSeconds < 86400) return `${differenceInHours(now, date)}h`;
  if (diffInSeconds < 604800) return `${differenceInDays(now, date)}d`;

  return format(date, 'MMM d');
}

/**
 * Format a date string to a human-readable distance (e.g., "5 minutes ago")
 * Uses date-fns formatDistanceToNow with addSuffix option
 *
 * @param dateString - ISO date string
 * @returns Formatted distance string with "ago" suffix
 */
export function formatTimeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

/**
 * Format a date string for display in a detailed format
 * e.g., "Dec 14, 2024, 6:30 AM"
 *
 * @param dateString - ISO date string
 * @returns Formatted date-time string
 */
export function formatDateTime(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy, h:mm a');
}

/**
 * Format a date string for scheduled status display
 * e.g., "Saturday, December 14, 2024 at 06:30 AM"
 *
 * @param dateString - ISO date string
 * @returns Formatted full date-time string
 */
export function formatScheduledDate(dateString: string): string {
  return format(parseISO(dateString), "EEEE, MMMM d, yyyy 'at' hh:mm a");
}

/**
 * Format a date string to show "Month Year" for join dates
 * e.g., "December 2024"
 *
 * @param dateString - ISO date string
 * @returns Formatted month and year string
 */
export function formatJoinDate(dateString: string): string {
  return format(parseISO(dateString), 'MMMM yyyy');
}

/**
 * Format a date string for poll expiration display
 * e.g., "Dec 14, 2024, 6:30 PM"
 *
 * @param dateString - ISO date string
 * @returns Formatted date-time string
 */
export function formatPollExpiration(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy, h:mm a');
}

/**
 * Format a date string for verification display (short date only)
 * e.g., "Dec 14, 2024"
 *
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatVerificationDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy');
}

/**
 * Convert a Date to a local ISO string (for datetime-local inputs)
 * Handles timezone offset to ensure the displayed time matches local time
 *
 * @param date - Date object
 * @returns Local ISO string in "yyyy-MM-dd'T'HH:mm" format
 */
export function toLocalISOString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Parse an ISO string and convert to a Date object
 *
 * @param dateString - ISO date string
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}
