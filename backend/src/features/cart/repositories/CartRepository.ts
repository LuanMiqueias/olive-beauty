import { PrismaClient, Cart } from '@prisma/client';

const prisma = new PrismaClient();

export class CartRepository {
  async findByUserId(userId: string): Promise<Cart | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isCover: true }, take: 1 },
              },
            },
            productVariant: true,
          },
        },
      },
    });
  }

  async create(userId: string): Promise<Cart> {
    return prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isCover: true }, take: 1 },
              },
            },
            productVariant: true,
          },
        },
      },
    });
  }

  async findOrCreate(userId: string): Promise<Cart> {
    let cart = await this.findByUserId(userId);

    if (!cart) {
      cart = await this.create(userId);
    }

    return cart;
  }

  async clear(userId: string): Promise<void> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }
}

