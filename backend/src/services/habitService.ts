import * as HabitModel from '../models/Habit';
import * as CheckInModel from '../models/CheckIn';
import { computeStreaks } from './streakService';
import { getUserLocalToday } from '../utils/dateUtils';
import { NotFoundError, ForbiddenError } from '../middleware/errors';
import { Habit, HabitWithStreaks, HabitDetail, ID } from '../types';

export async function createHabit(
  userId: ID,
  name: string,
  description?: string
): Promise<Habit> {
  return HabitModel.create(userId, name, description);
}

export async function getHabitsWithStreaks(
  userId: ID,
  userTimezone: string
): Promise<HabitWithStreaks[]> {
  const habits = await HabitModel.findByUserId(userId);
  const today = getUserLocalToday(userTimezone);

  const results: HabitWithStreaks[] = [];
  for (const habit of habits) {
    const dates = await CheckInModel.getLocalDatesForHabit(habit.id);
    const streaks = computeStreaks(dates, userTimezone);
    results.push({
      ...habit,
      streaks,
      checkedInToday: dates.includes(today),
    });
  }

  return results;
}

export async function getHabitDetail(
  habitId: ID,
  userId: ID,
  userTimezone: string
): Promise<HabitDetail> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  const checkIns = await CheckInModel.findByHabitId(habitId);
  const dates = checkIns.map((c) => c.local_date);
  const streaks = computeStreaks(dates, userTimezone);

  return {
    ...habit,
    streaks,
    checkIns,
  };
}

export async function updateHabit(
  habitId: ID,
  userId: ID,
  name: string,
  description?: string
): Promise<Habit> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  const updated = await HabitModel.update(habitId, name, description);
  return updated!;
}

export async function deleteHabit(
  habitId: ID,
  userId: ID
): Promise<void> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  await HabitModel.deleteById(habitId);
}
