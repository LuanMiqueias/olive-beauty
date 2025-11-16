import { CategoryRepository } from '../repositories/CategoryRepository';
import { CreateCategoryDTO } from '../dtos/CreateCategoryDTO';
import { AppError } from '../../../shared/errors/AppError';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(data: CreateCategoryDTO) {
    const existingCategory = await this.categoryRepository.findById(
      data.name
    );

    // Check by name instead
    const allCategories = await this.categoryRepository.findAll();
    const categoryExists = allCategories.some(
      (cat) => cat.name.toLowerCase() === data.name.toLowerCase()
    );

    if (categoryExists) {
      throw new AppError('Categoria com este nome já existe', 409);
    }

    return this.categoryRepository.create(data);
  }
}

