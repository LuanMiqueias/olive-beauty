import { ProductRepository, ListProductsFilters } from '../repositories/ProductRepository';

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(filters: ListProductsFilters) {
    return this.productRepository.findAll(filters);
  }
}

