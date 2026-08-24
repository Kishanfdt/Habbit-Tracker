import { format } from 'date-fns';
import { query } from '../config/database';
import { CheckIn } from '../types';

function formatLocalDate(val: unknown): string {
  if (val instanceof Date) {
    return format(val, 'yyyy-MM-dd');
  }
  return String(val);
}

export async function create(
  habitId: number,
  userId: number,
  checkedInAt: Date,
  localDate: string
): Promise<CheckIn> {
  const result = await query(
    `INSERT INTO check_ins (habit_id, user_id, checked_in_at, local_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [habitId, userId, checkedInAt, localDate]
  );
  const row = result.rows[0];
  if (row) {
    row.local_date = formatLocalDate(row.local_date);
  }
  return row;
}

export async function findByHabitId(habitId: number): Promise<CheckIn[]> {
  const result = await query(
    'SELECT * FROM check_ins WHERE habit_id = $1 ORDER BY local_date ASC',
    [habitId]
  );
  return result.rows.map((row) => {
    row.local_date = formatLocalDate(row.local_date);
    return row;
  });
}

export async function getLocalDatesForHabit(habitId: number): Promise<string[]> {
  const result = await query(
    'SELECT local_date FROM check_ins WHERE habit_id = $1 ORDER BY local_date ASC',
    [habitId]
  );
  return result.rows.map((row) => formatLocalDate(row.local_date));
}

export async function findById(id: number): Promise<CheckIn | null> {
  const result = await query('SELECT * FROM check_ins WHERE id = $1', [id]);
  const row = result.rows[0];
  if (!row) return null;
  row.local_date = formatLocalDate(row.local_date);
  return row;
}

export async function deleteById(id: number): Promise<boolean> {
  const result = await query('DELETE FROM check_ins WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}
