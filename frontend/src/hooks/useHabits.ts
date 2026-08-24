import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { ID } from '../types';

export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
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
      id: ID;
      updates: { name?: string; description?: string };
    }) => api.updateHabit(id, updates),
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
    },
  });
}
