import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Handle MongoDB duplicate key error (11000)
  const code = (err as unknown as Record<string, unknown>).code;
  if (code === 11000 || code === '11000') {
    res.status(409).json({ error: 'Already checked in for this date' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
