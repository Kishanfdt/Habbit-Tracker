import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from './errors';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Authentication required');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      timezone: decoded.timezone,
    };
    next();
  } catch {
    throw new AuthError('Invalid or expired token');
  }
}
