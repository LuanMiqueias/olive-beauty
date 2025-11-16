import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetTopProductsUseCase {
  async execute(limit: number = 10) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const productIds = topProducts.map((p) => p.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        images: { where: { isCover: true }, take: 1 },
      },
    });

    return topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        product,
        totalSold: item._sum.quantity || 0,
      };
    });
  }
}

