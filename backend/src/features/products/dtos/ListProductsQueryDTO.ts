import { z } from 'zod';

export const listProductsQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'name', 'createdAt']).optional(),
});

export type ListProductsQueryDTO = z.infer<typeof listProductsQuerySchema>;

