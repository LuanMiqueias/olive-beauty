import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
  productVariantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
});

export type AddToCartDTO = z.infer<typeof addToCartSchema>;

