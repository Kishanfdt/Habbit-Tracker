import { Request, Response, NextFunction } from 'express';
import * as habitService from '../services/habitService';
import * as CheckInModel from '../models/CheckIn';
import * as analyticsService from '../services/analyticsService';
import * as HabitModel from '../models/Habit';
import { NotFoundError, ForbiddenError } from '../middleware/errors';

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { habits } = await habitService.getHabitsWithStreaks(req.user.id, req.user.timezone);
    const checkInsByHabit: Record<string, string[]> = {};

    for (const habit of habits) {
      const dates = await CheckInModel.getLocalDatesForHabit(habit.id);
      checkInsByHabit[habit.id] = dates;
    }

    const stats = analyticsService.getOverviewStats(habits, checkInsByHabit, req.user.timezone);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getHabitAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const daysParam = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const days = isNaN(daysParam) || daysParam <= 0 ? 30 : daysParam;

    const habit = await HabitModel.findById(id);
    if (!habit) {
      throw new NotFoundError('Habit not found');
    }
    if (String(habit.user_id) !== String(req.user.id)) {
      throw new ForbiddenError('You do not own this habit');
    }

    const dates = await CheckInModel.getLocalDatesForHabit(id);
    const trend = analyticsService.getHabitTrend(dates, days, req.user.timezone);

    res.json({ habitId: id, days, trend });
  } catch (error) {
    next(error);
  }
}
