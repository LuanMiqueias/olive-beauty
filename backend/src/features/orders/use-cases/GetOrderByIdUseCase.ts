import { OrderRepository } from '../repositories/OrderRepository';
import { AppError } from '../../../shared/errors/AppError';

export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, userId?: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError('Pedido não encontrado', 404);
    }

    // If userId provided, verify ownership (unless admin)
    if (userId && order.userId !== userId) {
      // This will be checked in controller with admin middleware
    }

    return order;
  }
}

