import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddress: z.string().min(1, 'Endereço é obrigatório'),
  shippingName: z.string().min(1, 'Nome é obrigatório'),
  shippingPhone: z.string().optional(),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

