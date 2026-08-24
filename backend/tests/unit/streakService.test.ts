import { computeStreaks } from '../../src/services/streakService';
import * as dateUtils from '../../src/utils/dateUtils';

// Mock specific exports of dateUtils
jest.mock('../../src/utils/dateUtils', () => {
  const original = jest.requireActual('../../src/utils/dateUtils');
  return {
    ...original,
    getUserLocalToday: jest.fn(),
  };
});

describe('Streak Service Unit Tests', () => {
  const mockTimezone = 'Asia/Kolkata';

  beforeEach(() => {
    // Default mock today: 2026-03-12
    (dateUtils.getUserLocalToday as jest.Mock).mockReturnValue('2026-03-12');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Empty check-ins list should return (0, 0)', () => {
    const result = computeStreaks([], mockTimezone);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  test('Single check-in today should return (1, 1)', () => {
    const result = computeStreaks(['2026-03-12'], mockTimezone);
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  test('Single check-in yesterday should return (1, 1)', () => {
    const result = computeStreaks(['2026-03-11'], mockTimezone);
    expect(result).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  test('Single check-in older than yesterday (e.g. 3 days ago) should return (0, 1)', () => {
    const result = computeStreaks(['2026-03-09'], mockTimezone);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 1 });
  });

  test('Worked Example: check-ins on 10th, 11th, 12th with today=2026-03-12 returns (3, 3)', () => {
    const result = computeStreaks(['2026-03-10', '2026-03-11', '2026-03-12'], mockTimezone);
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  test('Standard consecutive dates ending today returns correct counts', () => {
    const dates = ['2026-03-08', '2026-03-09', '2026-03-10', '2026-03-11', '2026-03-12'];
    const result = computeStreaks(dates, mockTimezone);
    expect(result).toEqual({ currentStreak: 5, longestStreak: 5 });
  });

  test('Standard consecutive dates ending yesterday returns correct counts', () => {
    const dates = ['2026-03-09', '2026-03-10', '2026-03-11'];
    const result = computeStreaks(dates, mockTimezone);
    // Since today is 12, checkins ending on 11th is still alive (yesterday)
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  test('Streak broken ending 2 days ago returns current=0, longest=longest run', () => {
    const dates = ['2026-03-08', '2026-03-09', '2026-03-10'];
    const result = computeStreaks(dates, mockTimezone);
    expect(result).toEqual({ currentStreak: 0, longestStreak: 3 });
  });

  test('Multiple gaps returns longestStreak as the max consecutive run', () => {
    // Run 1: 2026-03-01 to 2026-03-03 (3 days)
    // Run 2: 2026-03-05 to 2026-03-08 (4 days)
    // Run 3: 2026-03-11 to 2026-03-12 (2 days, ending today)
    const dates = [
      '2026-03-01',
      '2026-03-02',
      '2026-03-03',
      '2026-03-05',
      '2026-03-06',
      '2026-03-07',
      '2026-03-08',
      '2026-03-11',
      '2026-03-12',
    ];
    const result = computeStreaks(dates, mockTimezone);
    expect(result).toEqual({ currentStreak: 2, longestStreak: 4 });
  });

  test('Input dates out of order are correctly sorted and processed', () => {
    const dates = ['2026-03-12', '2026-03-10', '2026-03-11'];
    const result = computeStreaks(dates, mockTimezone);
    expect(result).toEqual({ currentStreak: 3, longestStreak: 3 });
  });

  test('Backfilling a gap merges streaks', () => {
    const datesWithoutMerge = ['2026-03-09', '2026-03-11', '2026-03-12'];
    const initialResult = computeStreaks(datesWithoutMerge, mockTimezone);
    expect(initialResult).toEqual({ currentStreak: 2, longestStreak: 2 });

    const datesWithMerge = ['2026-03-09', '2026-03-10', '2026-03-11', '2026-03-12'];
    const updatedResult = computeStreaks(datesWithMerge, mockTimezone);
    expect(updatedResult).toEqual({ currentStreak: 4, longestStreak: 4 });
  });
});
