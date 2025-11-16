import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryRepository {
  async create(data: { name: string; description?: string }): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: { name?: string; description?: string }
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}

