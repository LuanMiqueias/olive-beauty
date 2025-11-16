import { CartRepository } from '../repositories/CartRepository';

export class ClearCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(userId: string) {
    await this.cartRepository.clear(userId);
  }
}

