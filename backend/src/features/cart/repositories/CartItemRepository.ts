import { PrismaClient, CartItem } from '@prisma/client';

const prisma = new PrismaClient();

export class CartItemRepository {
  async findById(id: string): Promise<CartItem | null> {
    return prisma.cartItem.findUnique({
      where: { id },
    });
  }

  async findByCartAndProduct(
    cartId: string,
    productId: string,
    productVariantId?: string
  ): Promise<CartItem | null> {
    return prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        productVariantId: productVariantId || null,
      },
    });
  }

  async create(data: {
    cartId: string;
    productId: string;
    productVariantId?: string;
    quantity: number;
  }): Promise<CartItem> {
    return prisma.cartItem.create({
      data,
    });
  }

  async update(id: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { id },
    });
  }
}

