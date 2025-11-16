import { CartItemRepository } from '../repositories/CartItemRepository';
import { AppError } from '../../../shared/errors/AppError';

export class RemoveItemFromCartUseCase {
  constructor(private cartItemRepository: CartItemRepository) {}

  async execute(cartItemId: string, userId: string) {
    const cartItem = await this.cartItemRepository.findById(cartItemId);

    if (!cartItem) {
      throw new AppError('Item do carrinho não encontrado', 404);
    }

    await this.cartItemRepository.delete(cartItemId);
  }
}

