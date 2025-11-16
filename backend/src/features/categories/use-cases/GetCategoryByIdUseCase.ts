import { CategoryRepository } from '../repositories/CategoryRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }

    return category;
  }
}

