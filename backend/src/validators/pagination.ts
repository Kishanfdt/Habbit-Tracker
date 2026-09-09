import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'page must be greater than or equal to 1').default(1),
  limit: z.coerce.number().int().min(1, 'limit must be greater than or equal to 1').max(100, 'limit must not exceed 100').default(20),
});

export const habitListQuerySchema = paginationQuerySchema.extend({
  includeArchived: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type HabitListQuery = z.infer<typeof habitListQuerySchema>;
