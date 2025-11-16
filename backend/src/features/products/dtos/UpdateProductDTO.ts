import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
  basePrice: z.number().positive('Preço base deve ser positivo').optional(),
  brand: z.string().optional(),
  categoryId: z.string().uuid('Categoria inválida').optional(),
});

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

