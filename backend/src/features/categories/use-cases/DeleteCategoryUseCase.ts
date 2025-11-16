import { CategoryRepository } from '../repositories/CategoryRepository';
import { AppError } from '../../../shared/errors/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new AppError(
        'Não é possível deletar categoria com produtos associados',
        400
      );
    }

    await this.categoryRepository.delete(id);
  }
}

