export interface User {
  id: number;
  email: string;
  password_hash: string;
  timezone: string;
  created_at: Date;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface CheckIn {
  id: number;
  habit_id: number;
  user_id: number;
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
  id: number;
  email: string;
  timezone: string;
}
