import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, timezone } = req.body;
    const result = await authService.signup(email, password, timezone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
