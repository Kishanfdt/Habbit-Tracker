import { Request, Response, NextFunction } from 'express';
import * as habitService from '../services/habitService';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { name, description } = req.body;
    const habit = await habitService.createHabit(req.user.id, name, description);
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const habits = await habitService.getHabitsWithStreaks(req.user.id, req.user.timezone);
    res.json({ habits });
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
    const { name, description } = req.body;
    const habit = await habitService.updateHabit(
      id,
      req.user.id,
      name,
      description
    );
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
