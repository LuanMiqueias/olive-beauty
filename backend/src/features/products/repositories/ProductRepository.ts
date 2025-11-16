import { PrismaClient, Product, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ListProductsFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'createdAt';
}

export class ProductRepository {
  async create(data: {
    name: string;
    description?: string;
    basePrice: number;
    brand?: string;
    categoryId: string;
  }): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

  async findAll(filters: ListProductsFilters = {}): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.brand) {
      where.brand = { contains: filters.brand, mode: 'insensitive' };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Price filtering will be done on variants
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (filters.sortBy === 'price_asc') {
      orderBy.basePrice = 'asc';
    } else if (filters.sortBy === 'price_desc') {
      orderBy.basePrice = 'desc';
    } else if (filters.sortBy === 'name') {
      orderBy.name = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          where: { isCover: true },
          take: 1,
        },
        variants: {
          take: 1,
        },
      },
      orderBy,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      basePrice?: number;
      brand?: string;
      categoryId?: string;
    }
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}

