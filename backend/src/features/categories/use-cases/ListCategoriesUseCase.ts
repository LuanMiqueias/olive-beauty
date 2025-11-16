import { CategoryRepository } from '../repositories/CategoryRepository';

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute() {
    return this.categoryRepository.findAll();
  }
}

