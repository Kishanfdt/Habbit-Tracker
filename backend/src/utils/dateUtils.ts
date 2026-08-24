import { toZonedTime } from 'date-fns-tz';
import { format, parseISO, subDays } from 'date-fns';

/**
 * Convert a UTC Date to the user's local date string (YYYY-MM-DD).
 *
 * Example: utcToLocalDateStr(new Date('2026-03-11T21:30Z'), 'Asia/Kolkata')
 *          → '2026-03-12' (because UTC+05:30 makes it 03:00 on the 12th)
 */
export function utcToLocalDateStr(utcDate: Date, timezone: string): string {
  const zonedTime = toZonedTime(utcDate, timezone);
  return format(zonedTime, 'yyyy-MM-dd');
}

/**
 * Get the user's current local date as YYYY-MM-DD.
 */
export function getUserLocalToday(timezone: string): string {
  const now = new Date();
  const zonedTime = toZonedTime(now, timezone);
  return format(zonedTime, 'yyyy-MM-dd');
}

/**
 * Parse a YYYY-MM-DD string to a Date (midnight UTC).
 */
export function parseLocalDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Get yesterday's date string relative to a given date string.
 */
export function getYesterday(dateStr: string): string {
  return format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
}

/**
 * Check if dateStr is strictly after the user's local today.
 * String comparison works correctly for YYYY-MM-DD format.
 */
export function isFutureDate(dateStr: string, timezone: string): boolean {
  const today = getUserLocalToday(timezone);
  return dateStr > today;
}

/**
 * Check if dateStr is strictly before referenceStr.
 */
export function isBeforeDate(dateStr: string, referenceStr: string): boolean {
  return dateStr < referenceStr;
}
