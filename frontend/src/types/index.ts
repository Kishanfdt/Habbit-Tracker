export interface User {
  id: number;
  email: string;
  timezone: string;
  created_at: string;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CheckIn {
  id: number;
  habit_id: number;
  user_id: number;
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
