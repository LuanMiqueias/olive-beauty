import { ProductRepository } from '../repositories/ProductRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetProductByIdUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return product;
  }
}

