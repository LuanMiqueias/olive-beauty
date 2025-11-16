import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SENT', 'DELIVERED', 'CANCELLED']),
});

export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;

