import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import { ID } from '../types';

export function useOverviewAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: api.getOverviewAnalytics,
  });
}

export function useHabitAnalytics(id: ID, days: number = 30) {
  return useQuery({
    queryKey: ['analytics', 'habit', id, days],
    queryFn: () => api.getHabitAnalytics(id, days),
    enabled: !!id,
  });
}
