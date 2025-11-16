import { ProductRepository } from '../repositories/ProductRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    await this.productRepository.delete(id);
  }
}

