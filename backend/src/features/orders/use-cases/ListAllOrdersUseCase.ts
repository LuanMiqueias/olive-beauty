import { OrderRepository } from '../repositories/OrderRepository';

export class ListAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute() {
    return this.orderRepository.findAll();
  }
}

