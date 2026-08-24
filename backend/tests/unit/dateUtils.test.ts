import {
  utcToLocalDateStr,
  getUserLocalToday,
  isFutureDate,
  isBeforeDate,
} from '../../src/utils/dateUtils';

describe('Date Utilities Unit Tests', () => {
  describe('utcToLocalDateStr', () => {
    test('Asia/Kolkata (UTC+05:30) Worked Example values', () => {
      // Worked Example A: 2026-03-10T14:30Z → local (14:30 + 5:30 = 20:00) → 2026-03-10
      const a = new Date('2026-03-10T14:30:00Z');
      expect(utcToLocalDateStr(a, 'Asia/Kolkata')).toBe('2026-03-10');

      // Worked Example B: 2026-03-11T10:30Z → local (10:30 + 5:30 = 16:00) → 2026-03-11
      const b = new Date('2026-03-11T10:30:00Z');
      expect(utcToLocalDateStr(b, 'Asia/Kolkata')).toBe('2026-03-11');

      // Worked Example C: 2026-03-11T21:30Z → local (21:30 + 5:30 = 03:00 next day) → 2026-03-12
      const c = new Date('2026-03-11T21:30:00Z');
      expect(utcToLocalDateStr(c, 'Asia/Kolkata')).toBe('2026-03-12');
    });

    test('US/Eastern (UTC-05:00 / UTC-04:00 DST)', () => {
      // 2026-03-11T03:00Z → local (03:00 - 5:00 = 22:00 previous day) → 2026-03-10
      const d = new Date('2026-03-11T03:00:00Z');
      expect(utcToLocalDateStr(d, 'America/New_York')).toBe('2026-03-10');

      // 2026-06-11T03:00Z → DST is active (UTC-04:00) → local (03:00 - 4:00 = 23:00 previous day) → 2026-06-10
      const e = new Date('2026-06-11T03:00:00Z');
      expect(utcToLocalDateStr(e, 'America/New_York')).toBe('2026-06-10');
    });
  });

  describe('getUserLocalToday', () => {
    test('Should return a string in YYYY-MM-DD format', () => {
      const today = getUserLocalToday('Asia/Kolkata');
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isFutureDate', () => {
    test('Recognizes future dates based on current timezone today', () => {
      const timezone = 'UTC';
      const today = getUserLocalToday(timezone);
      const tomorrowParts = today.split('-');
      const year = parseInt(tomorrowParts[0]);
      const month = parseInt(tomorrowParts[1]);
      const day = parseInt(tomorrowParts[2]);

      // Calculate a guaranteed tomorrow date string
      const tomorrowObj = new Date(Date.UTC(year, month - 1, day + 1));
      const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

      expect(isFutureDate(tomorrowStr, timezone)).toBe(true);
      expect(isFutureDate(today, timezone)).toBe(false);
      expect(isFutureDate('2020-01-01', timezone)).toBe(false);
    });
  });

  describe('isBeforeDate', () => {
    test('Correctly compares YYYY-MM-DD date strings', () => {
      expect(isBeforeDate('2026-03-10', '2026-03-11')).toBe(true);
      expect(isBeforeDate('2026-03-11', '2026-03-10')).toBe(false);
      expect(isBeforeDate('2026-03-10', '2026-03-10')).toBe(false);
    });
  });
});
