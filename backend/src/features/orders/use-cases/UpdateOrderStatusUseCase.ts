import { OrderRepository } from '../repositories/OrderRepository';
import { UpdateOrderStatusDTO } from '../dtos/UpdateOrderStatusDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string, data: UpdateOrderStatusDTO) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError('Pedido não encontrado', 404);
    }

    return this.orderRepository.updateStatus(id, data.status);
  }
}

