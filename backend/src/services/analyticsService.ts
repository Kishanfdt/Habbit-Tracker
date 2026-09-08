import { format, subDays, parseISO } from 'date-fns';
import { getUserLocalToday } from '../utils/dateUtils';
import { HabitWithStreaks, CheckIn } from '../types';

export interface OverviewStats {
  totalHabits: number;
  activeStreaksCount: number;
  completionRate7d: number;
  completionRate30d: number;
}

export interface HabitTrendPoint {
  date: string;
  checkedIn: boolean;
}

export function getOverviewStats(
  habits: HabitWithStreaks[],
  checkInsByHabit: Record<string, string[]>,
  userTimezone: string = 'UTC'
): OverviewStats {
  const totalHabits = habits.length;
  const activeStreaksCount = habits.filter((h) => h.streaks.currentStreak > 0).length;

  if (totalHabits === 0) {
    return {
      totalHabits: 0,
      activeStreaksCount: 0,
      completionRate7d: 0,
      completionRate30d: 0,
    };
  }

  const today = getUserLocalToday(userTimezone);

  const getDates = (numDays: number) => {
    const dates = new Set<string>();
    for (let i = 0; i < numDays; i++) {
      dates.add(format(subDays(parseISO(today), i), 'yyyy-MM-dd'));
    }
    return dates;
  };

  const last7Days = getDates(7);
  const last30Days = getDates(30);

  let checkIns7d = 0;
  let checkIns30d = 0;

  for (const habit of habits) {
    const dates = checkInsByHabit[habit.id] || [];
    for (const d of dates) {
      if (last7Days.has(d)) checkIns7d++;
      if (last30Days.has(d)) checkIns30d++;
    }
  }

  const completionRate7d = Math.round((checkIns7d / (totalHabits * 7)) * 100 * 10) / 10;
  const completionRate30d = Math.round((checkIns30d / (totalHabits * 30)) * 100 * 10) / 10;

  return {
    totalHabits,
    activeStreaksCount,
    completionRate7d,
    completionRate30d,
  };
}

export function getHabitTrend(
  checkIns: (string | CheckIn)[],
  days: number = 30,
  userTimezone: string = 'UTC'
): HabitTrendPoint[] {
  const dateSet = new Set<string>();
  for (const item of checkIns) {
    if (typeof item === 'string') {
      dateSet.add(item);
    } else if (item && item.local_date) {
      dateSet.add(item.local_date);
    }
  }

  const today = getUserLocalToday(userTimezone);
  const trend: HabitTrendPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dateStr = format(subDays(parseISO(today), i), 'yyyy-MM-dd');
    trend.push({
      date: dateStr,
      checkedIn: dateSet.has(dateStr),
    });
  }

  return trend;
}
