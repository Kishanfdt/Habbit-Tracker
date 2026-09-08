import { getOverviewStats, getHabitTrend } from '../../src/services/analyticsService';
import { HabitWithStreaks } from '../../src/types';
import { format, subDays, parseISO } from 'date-fns';
import { getUserLocalToday } from '../../src/utils/dateUtils';

const TZ = 'Asia/Kolkata';
const today = getUserLocalToday(TZ);
const daysAgo = (n: number) => format(subDays(parseISO(today), n), 'yyyy-MM-dd');

describe('analyticsService Unit Tests', () => {
  describe('getOverviewStats', () => {
    test('returns zeros when habits list is empty (no check-ins)', () => {
      const stats = getOverviewStats([], {}, TZ);
      expect(stats).toEqual({
        totalHabits: 0,
        activeStreaksCount: 0,
        completionRate7d: 0,
        completionRate30d: 0,
      });
    });

    test('calculates stats for partial history', () => {
      const habits: HabitWithStreaks[] = [
        {
          id: 'h1',
          user_id: 'u1',
          name: 'Habit 1',
          description: null,
          created_at: new Date(),
          streaks: { currentStreak: 3, longestStreak: 5 },
          checkedInToday: true,
        },
        {
          id: 'h2',
          user_id: 'u1',
          name: 'Habit 2',
          description: null,
          created_at: new Date(),
          streaks: { currentStreak: 0, longestStreak: 2 },
          checkedInToday: false,
        },
      ];

      // Habit 1 checked in today, 1 day ago, 2 days ago (3 check-ins in 7d/30d)
      // Habit 2 checked in 10 days ago (0 in 7d, 1 in 30d)
      const checkInsByHabit = {
        h1: [daysAgo(0), daysAgo(1), daysAgo(2)],
        h2: [daysAgo(10)],
      };

      const stats = getOverviewStats(habits, checkInsByHabit, TZ);

      expect(stats.totalHabits).toBe(2);
      expect(stats.activeStreaksCount).toBe(1);
      // 7d: 3 checkins out of (2 * 7) = 14 => 3/14 * 100 = 21.4%
      expect(stats.completionRate7d).toBe(21.4);
      // 30d: 4 checkins out of (2 * 30) = 60 => 4/60 * 100 = 6.7%
      expect(stats.completionRate30d).toBe(6.7);
    });

    test('calculates stats for full history', () => {
      const habits: HabitWithStreaks[] = [
        {
          id: 'h1',
          user_id: 'u1',
          name: 'Habit 1',
          description: null,
          created_at: new Date(),
          streaks: { currentStreak: 30, longestStreak: 30 },
          checkedInToday: true,
        },
      ];

      const full30 = Array.from({ length: 30 }, (_, i) => daysAgo(i));
      const checkInsByHabit = { h1: full30 };

      const stats = getOverviewStats(habits, checkInsByHabit, TZ);

      expect(stats.totalHabits).toBe(1);
      expect(stats.activeStreaksCount).toBe(1);
      expect(stats.completionRate7d).toBe(100);
      expect(stats.completionRate30d).toBe(100);
    });

    test('calculates stats with a gap in the middle', () => {
      const habits: HabitWithStreaks[] = [
        {
          id: 'h1',
          user_id: 'u1',
          name: 'Habit 1',
          description: null,
          created_at: new Date(),
          streaks: { currentStreak: 1, longestStreak: 5 },
          checkedInToday: true,
        },
      ];

      // Checked in today (0), gap at 1, checked in at 2 and 3
      const checkInsByHabit = {
        h1: [daysAgo(0), daysAgo(2), daysAgo(3)],
      };

      const stats = getOverviewStats(habits, checkInsByHabit, TZ);

      expect(stats.totalHabits).toBe(1);
      expect(stats.activeStreaksCount).toBe(1);
      // 7d: 3 / 7 = 42.9%
      expect(stats.completionRate7d).toBe(42.9);
      // 30d: 3 / 30 = 10%
      expect(stats.completionRate30d).toBe(10);
    });
  });

  describe('getHabitTrend', () => {
    test('returns trend array with checkedIn: false when no check-ins exist', () => {
      const trend = getHabitTrend([], 30, TZ);

      expect(trend.length).toBe(30);
      expect(trend[29].date).toBe(today);
      expect(trend.every((item) => item.checkedIn === false)).toBe(true);
    });

    test('returns correct trend for partial history', () => {
      const dates = [daysAgo(0), daysAgo(2)];
      const trend = getHabitTrend(dates, 5, TZ);

      expect(trend.length).toBe(5);
      // trend order is chronological ascending (oldest first, today last)
      expect(trend[4]).toEqual({ date: daysAgo(0), checkedIn: true });
      expect(trend[3]).toEqual({ date: daysAgo(1), checkedIn: false });
      expect(trend[2]).toEqual({ date: daysAgo(2), checkedIn: true });
      expect(trend[1]).toEqual({ date: daysAgo(3), checkedIn: false });
      expect(trend[0]).toEqual({ date: daysAgo(4), checkedIn: false });
    });

    test('returns correct trend for full history', () => {
      const dates = Array.from({ length: 10 }, (_, i) => daysAgo(i));
      const trend = getHabitTrend(dates, 10, TZ);

      expect(trend.length).toBe(10);
      expect(trend.every((item) => item.checkedIn === true)).toBe(true);
    });

    test('returns correct trend with a gap in the middle', () => {
      // Gap at daysAgo(1)
      const dates = [daysAgo(0), daysAgo(2), daysAgo(3)];
      const trend = getHabitTrend(dates, 4, TZ);

      expect(trend).toEqual([
        { date: daysAgo(3), checkedIn: true },
        { date: daysAgo(2), checkedIn: true },
        { date: daysAgo(1), checkedIn: false },
        { date: daysAgo(0), checkedIn: true },
      ]);
    });
  });
});
