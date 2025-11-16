import { CartItemRepository } from '../repositories/CartItemRepository';
import { ProductVariantRepository } from '../../products/repositories/ProductVariantRepository';
import { UpdateCartItemDTO } from '../dtos/UpdateCartItemDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateCartItemQuantityUseCase {
  constructor(
    private cartItemRepository: CartItemRepository,
    private productVariantRepository: ProductVariantRepository
  ) {}

  async execute(cartItemId: string, userId: string, data: UpdateCartItemDTO) {
    const cartItem = await this.cartItemRepository.findById(cartItemId);

    if (!cartItem) {
      throw new AppError('Item do carrinho não encontrado', 404);
    }

    // Check stock if variant exists
    if (cartItem.productVariantId) {
      const variant = await this.productVariantRepository.findById(
        cartItem.productVariantId
      );

      if (!variant) {
        throw new AppError('Variante não encontrada', 404);
      }

      if (variant.stock < data.quantity) {
        throw new AppError('Estoque insuficiente', 400);
      }
    }

    return this.cartItemRepository.update(cartItemId, data.quantity);
  }
}

