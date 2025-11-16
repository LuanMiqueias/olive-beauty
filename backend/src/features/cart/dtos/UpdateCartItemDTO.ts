import { z } from 'zod';

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
});

export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;

