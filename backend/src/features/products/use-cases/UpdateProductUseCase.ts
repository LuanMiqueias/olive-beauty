import { ProductRepository } from '../repositories/ProductRepository';
import { UpdateProductDTO } from '../dtos/UpdateProductDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, data: UpdateProductDTO) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return this.productRepository.update(id, data);
  }
}

