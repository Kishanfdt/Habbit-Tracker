import { Request, Response, NextFunction } from 'express';
import * as checkInService from '../services/checkInService';
import { paginationQuerySchema } from '../validators/pagination';
import { ValidationError } from '../middleware/errors';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id: habitId } = req.params;
    const { date } = req.body;

    const checkIn = await checkInService.createCheckIn(
      req.user.id,
      habitId,
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

    const parsed = paginationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const message = parsed.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new ValidationError(message);
    }
    const { page, limit } = parsed.data;

    const result = await checkInService.getCheckInsForHabit(
      habitId,
      req.user.id,
      page,
      limit
    );
    res.json({
      data: result.checkIns,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}
