import * as HabitModel from '../models/Habit';
import * as CheckInModel from '../models/CheckIn';
import {
  getUserLocalToday,
  utcToLocalDateStr,
  isFutureDate,
  isBeforeDate,
} from '../utils/dateUtils';
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  ConflictError,
} from '../middleware/errors';
import { CheckIn } from '../types';

export async function createCheckIn(
  userId: number,
  habitId: number,
  dateStr: string | undefined,
  userTimezone: string
): Promise<CheckIn> {
  // 1. Get habit, verify it exists and user owns it
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (habit.user_id !== userId) {
    throw new ForbiddenError('You do not own this habit');
  }

  // 2. Determine the local date for this check-in
  const localDate = dateStr || getUserLocalToday(userTimezone);

  // 3. Validate: not a future date
  if (isFutureDate(localDate, userTimezone)) {
    throw new ValidationError('Cannot check in for a future date');
  }

  // 4. Validate: not before habit creation
  const habitCreatedLocalDate = utcToLocalDateStr(habit.created_at, userTimezone);
  if (isBeforeDate(localDate, habitCreatedLocalDate)) {
    throw new ValidationError('Cannot check in for a date before the habit was created');
  }

  // 5. Insert — the DB UNIQUE constraint handles duplicate detection
  const now = new Date();
  try {
    const checkIn = await CheckInModel.create(habitId, userId, now, localDate);
    return checkIn;
  } catch (err: unknown) {
    // Postgres unique violation code
    if ((err as Record<string, unknown>).code === '23505') {
      throw new ConflictError('Already checked in for this date');
    }
    throw err;
  }
}

export async function getCheckInsForHabit(
  habitId: number,
  userId: number
): Promise<CheckIn[]> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (habit.user_id !== userId) {
    throw new ForbiddenError('You do not own this habit');
  }

  return CheckInModel.findByHabitId(habitId);
}
