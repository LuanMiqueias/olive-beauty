import { z } from 'zod';

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;

