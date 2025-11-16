import { PrismaClient, OrderItem } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderItemRepository {
  async create(data: {
    orderId: string;
    productId: string;
    productVariantId?: string;
    quantity: number;
    price: number;
  }): Promise<OrderItem> {
    return prisma.orderItem.create({
      data,
    });
  }
}

