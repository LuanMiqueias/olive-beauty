import { z } from 'zod';

export const productVariantSchema = z.object({
  attributes: z.record(z.string(), z.string()),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  basePrice: z.number().positive('Preço base deve ser positivo'),
  brand: z.string().optional(),
  categoryId: z.string().uuid('Categoria inválida'),
  variants: z.array(productVariantSchema).optional(),
  images: z.array(z.string().url('URL inválida')).optional(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;

