import { PrismaClient, Favorite } from '@prisma/client';

const prisma = new PrismaClient();

export class FavoriteRepository {
  async create(userId: string, productId: string): Promise<Favorite> {
    return prisma.favorite.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            images: { where: { isCover: true }, take: 1 },
            category: true,
          },
        },
      },
    });
  }

  async findByUserAndProduct(
    userId: string,
    productId: string
  ): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: { where: { isCover: true }, take: 1 },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(userId: string, productId: string): Promise<void> {
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}

