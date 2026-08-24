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
import { CheckIn, ID } from '../types';

export async function createCheckIn(
  userId: ID,
  habitId: ID,
  dateStr: string | undefined,
  userTimezone: string
): Promise<CheckIn> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  const localDate = dateStr || getUserLocalToday(userTimezone);

  if (isFutureDate(localDate, userTimezone)) {
    throw new ValidationError('Cannot check in for a future date');
  }

  const now = new Date();
  try {
    const checkIn = await CheckInModel.create(habitId, userId, now, localDate);
    return checkIn;
  } catch (err: unknown) {
    const code = (err as unknown as Record<string, unknown>).code;
    if (code === 11000 || code === '11000') {
      throw new ConflictError('Already checked in for this date');
    }
    throw err;
  }
}

export async function getCheckInsForHabit(
  habitId: ID,
  userId: ID
): Promise<CheckIn[]> {
  const habit = await HabitModel.findById(habitId);
  if (!habit) {
    throw new NotFoundError('Habit not found');
  }
  if (String(habit.user_id) !== String(userId)) {
    throw new ForbiddenError('You do not own this habit');
  }

  return CheckInModel.findByHabitId(habitId);
}
