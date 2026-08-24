import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/User';
import { AuthError, ConflictError, ValidationError } from '../middleware/errors';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function isValidTimezone(tz: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export async function signup(
  email: string,
  password: string,
  timezone: string
): Promise<{ token: string; user: { id: number; email: string; timezone: string } }> {
  if (!isValidTimezone(timezone)) {
    throw new ValidationError(`Invalid timezone: ${timezone}`);
  }

  const existing = await UserModel.findByEmail(email);
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create(email, passwordHash, timezone);

  const payload: AuthPayload = {
    id: user.id,
    email: user.email,
    timezone: user.timezone,
  };
  const token = generateToken(payload);

  return {
    token,
    user: { id: user.id, email: user.email, timezone: user.timezone },
  };
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: { id: number; email: string; timezone: string } }> {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AuthError('Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new AuthError('Invalid email or password');
  }

  const payload: AuthPayload = {
    id: user.id,
    email: user.email,
    timezone: user.timezone,
  };
  const token = generateToken(payload);

  return {
    token,
    user: { id: user.id, email: user.email, timezone: user.timezone },
  };
}
