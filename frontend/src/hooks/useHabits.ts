import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';

export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
  });
}

export function useHabit(id: number) {
  return useQuery({
    queryKey: ['habits', id],
    queryFn: () => api.getHabit(id),
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      api.createHabit(name, description),
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
      id: number;
      updates: { name?: string; description?: string };
    }) => api.updateHabit(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useDeleteHabit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteHabit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] }),
  });
}

export function useCreateCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: number; date?: string }) =>
      api.createCheckIn(habitId, date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
