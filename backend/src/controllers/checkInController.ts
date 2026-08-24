import { Request, Response, NextFunction } from 'express';
import * as checkInService from '../services/checkInService';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id: habitId } = req.params;
    const { date } = req.body;

    const checkIn = await checkInService.createCheckIn(
      req.user.id,
      parseInt(habitId),
      date,
      req.user.timezone
    );
    res.status(201).json(checkIn);
  } catch (error) {
    next(error);
  }
}

export async function getByHabit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id: habitId } = req.params;

    const checkIns = await checkInService.getCheckInsForHabit(
      parseInt(habitId),
      req.user.id
    );
    res.json({ checkIns });
  } catch (error) {
    next(error);
  }
}
