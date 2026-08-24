import { query } from '../config/database';
import { User } from '../types';

export async function findByEmail(email: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function findById(id: number): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function create(
  email: string,
  passwordHash: string,
  timezone: string
): Promise<User> {
  const result = await query(
    'INSERT INTO users (email, password_hash, timezone) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, timezone]
  );
  return result.rows[0];
}
