import { z } from 'zod';

export const categoryEnum = z.enum(['health', 'productivity', 'learning', 'fitness', 'other']);

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(255),
  description: z.string().max(1000).optional(),
  category: categoryEnum.optional(),
});

export const updateHabitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(255),
  description: z.string().max(1000).optional(),
  category: categoryEnum.optional(),
});
