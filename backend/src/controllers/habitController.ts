import { Request, Response, NextFunction } from 'express';
import * as habitService from '../services/habitService';
import { habitListQuerySchema } from '../validators/pagination';
import { ValidationError } from '../middleware/errors';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { name, description, category } = req.body;
    const habit = await habitService.createHabit(req.user.id, name, description, category);
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const parsed = habitListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const message = parsed.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new ValidationError(message);
    }
    const { page, limit, includeArchived } = parsed.data;
    const result = await habitService.getHabitsWithStreaks(
      req.user.id,
      req.user.timezone,
      includeArchived,
      page,
      limit
    );
    res.json({
      data: result.habits,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const habit = await habitService.getHabitDetail(
      id,
      req.user.id,
      req.user.timezone
    );
    res.json(habit);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const { name, description, category } = req.body;
    const habit = await habitService.updateHabit(
      id,
      req.user.id,
      name,
      description,
      category
    );
    res.json(habit);
  } catch (error) {
    next(error);
  }
}

export async function archive(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    const habit = await habitService.archiveHabit(req.user.id, id);
    res.json(habit);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    await habitService.deleteHabit(id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
