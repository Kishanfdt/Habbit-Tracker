import axios from 'axios';
import { AuthResponse, Habit, HabitWithStreaks, HabitDetail, CheckIn, User, ID, OverviewStats, HabitAnalyticsResponse, PaginatedResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to extract clean error message from API response
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// ── Auth ───────────────────────────────────────────────
export async function signup(
  email: string,
  password: string,
  timezone: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', {
    email,
    password,
    timezone,
  });
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}

// ── Habits ─────────────────────────────────────────────
export async function getHabits(
  includeArchived?: boolean,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<HabitWithStreaks>> {
  const params: Record<string, unknown> = { page, limit };
  if (includeArchived) params.includeArchived = true;
  const { data } = await api.get<PaginatedResponse<HabitWithStreaks>>('/habits', { params });
  return data;
}

export async function getHabit(id: ID): Promise<HabitDetail> {
  const { data } = await api.get<HabitDetail>(`/habits/${id}`);
  return data;
}

export async function createHabit(
  name: string,
  description?: string,
  category?: string,
): Promise<Habit> {
  const { data } = await api.post<Habit>('/habits', {
    name,
    description,
    category,
  });
  return data;
}

export async function updateHabit(
  id: ID,
  updates: { name?: string; description?: string; category?: string },
): Promise<Habit> {
  const { data } = await api.put<Habit>(`/habits/${id}`, updates);
  return data;
}

export async function archiveHabit(id: ID): Promise<Habit> {
  const { data } = await api.patch<Habit>(`/habits/${id}/archive`);
  return data;
}

export async function deleteHabit(id: ID): Promise<void> {
  await api.delete(`/habits/${id}`);
}

// ── Check-ins ──────────────────────────────────────────
export async function createCheckIn(
  habitId: ID,
  date?: string,
): Promise<CheckIn> {
  const body = date ? { date } : {};
  const { data } = await api.post<CheckIn>(
    `/habits/${habitId}/check-ins`,
    body,
  );
  return data;
}

export async function getCheckIns(
  habitId: ID,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<CheckIn>> {
  const { data } = await api.get<PaginatedResponse<CheckIn>>(
    `/habits/${habitId}/check-ins`,
    { params: { page, limit } }
  );
  return data;
}

// ── Analytics ──────────────────────────────────────────
export async function getOverviewAnalytics(): Promise<OverviewStats> {
  const { data } = await api.get<OverviewStats>('/analytics/overview');
  return data;
}

export async function getHabitAnalytics(id: ID, days: number = 30): Promise<HabitAnalyticsResponse> {
  const { data } = await api.get<HabitAnalyticsResponse>(`/habits/${id}/analytics`, {
    params: { days },
  });
  return data;
}
