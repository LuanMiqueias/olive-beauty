import { CartRepository } from '../repositories/CartRepository';

export class GetCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(userId: string) {
    return this.cartRepository.findOrCreate(userId);
  }
}

