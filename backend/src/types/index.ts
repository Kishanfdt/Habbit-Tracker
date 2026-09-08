export type ID = string;

export interface User {
  id: ID;
  email: string;
  password_hash: string;
  timezone: string;
  created_at: Date;
}

export type HabitCategory = 'health' | 'productivity' | 'learning' | 'fitness' | 'other';

export interface Habit {
  id: ID;
  user_id: ID;
  name: string;
  description: string | null;
  category?: string;
  archived?: boolean;
  created_at: Date;
}

export interface CheckIn {
  id: ID;
  habit_id: ID;
  user_id: ID;
  checked_in_at: Date;
  local_date: string; // YYYY-MM-DD
  created_at: Date;
}

export interface Streaks {
  currentStreak: number;
  longestStreak: number;
}

export interface HabitWithStreaks extends Habit {
  streaks: Streaks;
  checkedInToday: boolean;
}

export interface HabitDetail extends Habit {
  streaks: Streaks;
  checkIns: CheckIn[];
}

export interface AuthPayload {
  id: ID;
  email: string;
  timezone: string;
}
