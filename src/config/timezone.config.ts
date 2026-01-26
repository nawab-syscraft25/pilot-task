/**
 * Timezone configuration and utility functions
 * All dates in the application use IST (Indian Standard Time)
 */

export const TIMEZONE = 'Asia/Kolkata';
export const TIMEZONE_OFFSET = '+05:30';

/**
 * Get current date/time in IST
 */
export function getISTDate(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Convert UTC date to IST
 */
export function toIST(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Format date for IST display
 */
export function formatIST(date: Date): string {
  return date.toLocaleString('en-IN', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Get IST timestamp string for logging
 */
export function getISTTimestamp(): string {
  const now = new Date();
  return now.toLocaleString('en-IN', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
