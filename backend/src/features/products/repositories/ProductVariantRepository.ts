import { PrismaClient, ProductVariant } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductVariantRepository {
  async create(data: {
    productId: string;
    attributes: string; // JSON string
    price: number;
    stock: number;
  }): Promise<ProductVariant> {
    return prisma.productVariant.create({
      data,
    });
  }

  async findById(id: string): Promise<ProductVariant | null> {
    return prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    return prisma.productVariant.findMany({
      where: { productId },
    });
  }

  async update(
    id: string,
    data: {
      attributes?: string;
      price?: number;
      stock?: number;
    }
  ): Promise<ProductVariant> {
    return prisma.productVariant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.productVariant.delete({
      where: { id },
    });
  }

  async decrementStock(id: string, quantity: number): Promise<void> {
    await prisma.productVariant.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}

