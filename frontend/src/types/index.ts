export type ID = string | number;

export interface User {
  id: ID;
  email: string;
  timezone: string;
  created_at: string;
}

export type HabitCategory = 'health' | 'productivity' | 'learning' | 'fitness' | 'other';

export interface Habit {
  id: ID;
  user_id: ID;
  name: string;
  description: string | null;
  category?: HabitCategory | string;
  archived?: boolean;
  created_at: string;
}

export interface CheckIn {
  id: ID;
  habit_id: ID;
  user_id: ID;
  checked_in_at: string;
  local_date: string;
  created_at: string;
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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message: string;
}
