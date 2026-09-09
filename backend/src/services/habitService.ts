import * as HabitModel from '../models/Habit';
import * as CheckInModel from '../models/CheckIn';
import { computeStreaks } from './streakService';
import { getUserLocalToday } from '../utils/dateUtils';
import { NotFoundError, ForbiddenError } from '../middleware/errors';
import { Habit, HabitWithStreaks, HabitDetail, ID } from '../types';

export async function createHabit(
  userId: ID,
  name: string,
  description?: string,
  category?: string
): Promise<Habit> {
  return HabitModel.create(userId, name, description, category);
}

export interface PaginatedHabitsResponse {
  habits: HabitWithStreaks[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getHabitsWithStreaks(
  userId: ID,
  userTimezone: string,
  includeArchived: boolean = false,
  page?: number,
  limit?: number
): Promise<PaginatedHabitsResponse> {
  const isPaginated = page !== undefined && limit !== undefined;
  const p = page ?? 1;
  const l = limit ?? 20;

  const { habits, total } = await HabitModel.findByUserId(
    userId,
    includeArchived,
    isPaginated ? p : undefined,
    isPaginated ? l : undefined
  );
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

  const effectiveLimit = isPaginated ? l : Math.max(1, total);
  const totalPages = Math.ceil(total / effectiveLimit);

  return {
    habits: results,
    total,
    page: p,
    limit: isPaginated ? l : total,
    totalPages,
  };
}

export const listHabits = getHabitsWithStreaks;

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

  const { checkIns } = await CheckInModel.findByHabitId(habitId);
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
  description?: string,
  category?: string
): Promise<Habit> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  const updated = await HabitModel.update(habitId, name, description, category);
  return updated!;
}

export async function archiveHabit(arg1: ID, arg2: ID): Promise<Habit> {
  let habit = await HabitModel.findById(arg2);
  let targetUserId = arg1;
  let targetHabitId = arg2;

  if (!habit) {
    const altHabit = await HabitModel.findById(arg1);
    if (altHabit) {
      habit = altHabit;
      targetHabitId = arg1;
      targetUserId = arg2;
    }
  }

  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(targetUserId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  const updated = await HabitModel.archive(targetHabitId);
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
