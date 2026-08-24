import { query } from '../config/database';
import { Habit } from '../types';

export async function create(
  userId: number,
  name: string,
  description?: string
): Promise<Habit> {
  const result = await query(
    'INSERT INTO habits (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, name, description || null]
  );
  return result.rows[0];
}

export async function findByUserId(userId: number): Promise<Habit[]> {
  const result = await query(
    'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function findById(id: number): Promise<Habit | null> {
  const result = await query('SELECT * FROM habits WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function update(
  id: number,
  name: string,
  description?: string
): Promise<Habit | null> {
  const result = await query(
    'UPDATE habits SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description || null, id]
  );
  return result.rows[0] || null;
}

export async function deleteById(id: number): Promise<boolean> {
  const result = await query('DELETE FROM habits WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
