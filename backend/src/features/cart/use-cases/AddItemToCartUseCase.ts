import { CartRepository } from '../repositories/CartRepository';
import { CartItemRepository } from '../repositories/CartItemRepository';
import { ProductVariantRepository } from '../../products/repositories/ProductVariantRepository';
import { AddToCartDTO } from '../dtos/AddToCartDTO';
import { AppError } from '../../../shared/errors/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AddItemToCartUseCase {
  constructor(
    private cartRepository: CartRepository,
    private cartItemRepository: CartItemRepository,
    private productVariantRepository: ProductVariantRepository
  ) {}

  async execute(userId: string, data: AddToCartDTO) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Verify variant if provided
    if (data.productVariantId) {
      const variant = await this.productVariantRepository.findById(
        data.productVariantId
      );

      if (!variant || variant.productId !== data.productId) {
        throw new AppError('Variante não encontrada', 404);
      }

      if (variant.stock < data.quantity) {
        throw new AppError('Estoque insuficiente', 400);
      }
    } else {
      // Check base product stock (if no variants)
      // For now, we'll allow it if product has no variants
      const variants = await this.productVariantRepository.findByProductId(
        data.productId
      );
      if (variants.length > 0) {
        throw new AppError('Selecione uma variante', 400);
      }
    }

    // Get or create cart
    const cart = await this.cartRepository.findOrCreate(userId);

    // Check if item already exists
    const existingItem = await this.cartItemRepository.findByCartAndProduct(
      cart.id,
      data.productId,
      data.productVariantId
    );

    if (existingItem) {
      // Update quantity
      return this.cartItemRepository.update(
        existingItem.id,
        existingItem.quantity + data.quantity
      );
    }

    // Create new item
    return this.cartItemRepository.create({
      cartId: cart.id,
      productId: data.productId,
      productVariantId: data.productVariantId,
      quantity: data.quantity,
    });
  }
}

