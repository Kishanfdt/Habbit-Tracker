import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { ID } from '../types';

export function useHabits(includeArchived?: boolean, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['habits', { includeArchived, page, limit }],
    queryFn: () => api.getHabits(includeArchived, page, limit),
  });
}

export function useHabitCheckIns(habitId: ID, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['check-ins', habitId, { page, limit }],
    queryFn: () => api.getCheckIns(habitId, page, limit),
  });
}

export function useHabit(id: ID) {
  return useQuery({
    queryKey: ['habits', id],
    queryFn: () => api.getHabit(id),
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
      category,
    }: {
      name: string;
      description?: string;
      category?: string;
    }) => api.createHabit(name, description, category),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: ID;
      updates: { name?: string; description?: string; category?: string };
    }) => api.updateHabit(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useArchiveHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => api.archiveHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => api.deleteHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useCreateCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: ID; date?: string }) =>
      api.createCheckIn(habitId, date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['check-ins'] });
    },
  });
}
