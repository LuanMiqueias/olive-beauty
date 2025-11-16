import { PrismaClient, ProductImage } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductImageRepository {
  async create(data: {
    productId: string;
    url: string;
    isCover?: boolean;
  }): Promise<ProductImage> {
    return prisma.productImage.create({
      data,
    });
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    return prisma.productImage.findMany({
      where: { productId },
      orderBy: [{ isCover: 'desc' }, { createdAt: 'asc' }],
    });
  }

  async setAsCover(imageId: string, productId: string): Promise<void> {
    // Remove cover from all images of this product
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isCover: false },
    });

    // Set this image as cover
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isCover: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.productImage.delete({
      where: { id },
    });
  }
}

