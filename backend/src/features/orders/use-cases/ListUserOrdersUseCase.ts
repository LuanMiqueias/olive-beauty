import { OrderRepository } from '../repositories/OrderRepository';

export class ListUserOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute(userId: string) {
    return this.orderRepository.findByUserId(userId);
  }
}

