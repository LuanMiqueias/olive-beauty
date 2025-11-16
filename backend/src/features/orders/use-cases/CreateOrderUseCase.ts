import { OrderRepository } from '../repositories/OrderRepository';
import { OrderItemRepository } from '../repositories/OrderItemRepository';
import { CartRepository } from '../../cart/repositories/CartRepository';
import { ProductVariantRepository } from '../../products/repositories/ProductVariantRepository';
import { CreateOrderDTO } from '../dtos/CreateOrderDTO';
import { AppError } from '../../../shared/errors/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderItemRepository: OrderItemRepository,
    private cartRepository: CartRepository,
    private productVariantRepository: ProductVariantRepository
  ) {}

  async execute(userId: string, data: CreateOrderDTO) {
    // Get user's cart
    const cart = await this.cartRepository.findOrCreate(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new AppError('Carrinho vazio', 400);
    }

    // Calculate total and verify stock
    let total = 0;
    for (const item of cart.items) {
      const price = item.productVariant
        ? item.productVariant.price
        : item.product.basePrice;

      total += price * item.quantity;

      // Verify stock
      if (item.productVariantId) {
        const variant = await this.productVariantRepository.findById(
          item.productVariantId
        );

        if (!variant) {
          throw new AppError('Variante não encontrada', 404);
        }

        if (variant.stock < item.quantity) {
          throw new AppError(
            `Estoque insuficiente para ${item.product.name}`,
            400
          );
        }
      }
    }

    // Create order
    const order = await this.orderRepository.create({
      userId,
      total,
      shippingAddress: data.shippingAddress,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
    });

    // Create order items and decrement stock
    for (const item of cart.items) {
      const price = item.productVariant
        ? item.productVariant.price
        : item.product.basePrice;

      await this.orderItemRepository.create({
        orderId: order.id,
        productId: item.productId,
        productVariantId: item.productVariantId || undefined,
        quantity: item.quantity,
        price,
      });

      // Decrement stock
      if (item.productVariantId) {
        await this.productVariantRepository.decrementStock(
          item.productVariantId,
          item.quantity
        );
      }
    }

    // Clear cart
    await this.cartRepository.clear(userId);

    // Return order with items
    return this.orderRepository.findById(order.id);
  }
}

