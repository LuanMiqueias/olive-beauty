import { z } from 'zod';
import { productVariantSchema } from './CreateProductDTO';

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
  basePrice: z.number().positive('Preço base deve ser positivo').optional(),
  brand: z.string().optional(),
  categoryId: z.string().uuid('Categoria inválida').optional(),
  variants: z.array(productVariantSchema).optional(),
  images: z.array(z.string().url('URL inválida')).optional(),
});

export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

