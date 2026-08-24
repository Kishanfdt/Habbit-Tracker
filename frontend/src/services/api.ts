import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  HabitWithStreaks,
  HabitDetail,
  CheckIn,
  Habit,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

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

export async function getMe() {
  const { data } = await api.get<{ user: import('../types').User }>('/auth/me');
  return data.user;
}

// ── Habits ─────────────────────────────────────────────
export async function getHabits(): Promise<HabitWithStreaks[]> {
  const { data } = await api.get<{ habits: HabitWithStreaks[] }>('/habits');
  return data.habits;
}

export async function getHabit(id: number): Promise<HabitDetail> {
  const { data } = await api.get<HabitDetail>(`/habits/${id}`);
  return data;
}

export async function createHabit(
  name: string,
  description?: string,
): Promise<Habit> {
  const { data } = await api.post<Habit>('/habits', {
    name,
    description,
  });
  return data;
}

export async function updateHabit(
  id: number,
  updates: { name?: string; description?: string },
): Promise<Habit> {
  const { data } = await api.put<Habit>(`/habits/${id}`, updates);
  return data;
}

export async function deleteHabit(id: number): Promise<void> {
  await api.delete(`/habits/${id}`);
}

// ── Check-ins ──────────────────────────────────────────
export async function createCheckIn(
  habitId: number,
  date?: string,
): Promise<CheckIn> {
  const body = date ? { date } : {};
  const { data } = await api.post<CheckIn>(
    `/habits/${habitId}/check-ins`,
    body,
  );
  return data;
}

export async function getCheckIns(habitId: number): Promise<CheckIn[]> {
  const { data } = await api.get<{ checkIns: CheckIn[] }>(
    `/habits/${habitId}/check-ins`,
  );
  return data.checkIns;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || err.message;
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
