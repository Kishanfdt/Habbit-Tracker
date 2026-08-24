import { format, subDays, parseISO } from 'date-fns';
import { getUserLocalToday } from '../utils/dateUtils';

/**
 * Compute current and longest streaks from an array of local-date strings.
 *
 * This is a PURE function — no database access, no side-effects.
 * The only external dependency is getUserLocalToday (for "is the streak alive?").
 *
 * @param localDates  Array of YYYY-MM-DD strings (need not be sorted)
 * @param userTimezone  IANA timezone, e.g. 'Asia/Kolkata'
 */
export function computeStreaks(
  localDates: string[],
  userTimezone: string
): { currentStreak: number; longestStreak: number } {
  if (localDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort ascending (string comparison works for YYYY-MM-DD)
  const sorted = [...localDates].sort();

  // Determine "today" and "yesterday" in the user's timezone
  const today = getUserLocalToday(userTimezone);
  const yesterday = format(subDays(parseISO(today), 1), 'yyyy-MM-dd');

  const mostRecent = sorted[sorted.length - 1];

  // --- Current streak ---
  // A streak is "alive" only if the most recent check-in is today or yesterday.
  let currentStreak = 0;
  if (mostRecent === today || mostRecent === yesterday) {
    currentStreak = 1;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const expected = format(subDays(parseISO(sorted[i + 1]), 1), 'yyyy-MM-dd');
      if (sorted[i] === expected) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // --- Longest streak ---
  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prevExpected = format(subDays(parseISO(sorted[i]), 1), 'yyyy-MM-dd');
    if (sorted[i - 1] === prevExpected) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}
