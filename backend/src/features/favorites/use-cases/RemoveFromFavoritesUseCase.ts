import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { AppError } from '../../../shared/errors/AppError';

export class RemoveFromFavoritesUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(userId: string, productId: string) {
    const favorite = await this.favoriteRepository.findByUserAndProduct(
      userId,
      productId
    );

    if (!favorite) {
      throw new AppError('Favorito não encontrado', 404);
    }

    await this.favoriteRepository.delete(userId, productId);
  }
}

