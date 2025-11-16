import { FavoriteRepository } from '../repositories/FavoriteRepository';

export class ListFavoritesUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(userId: string) {
    return this.favoriteRepository.findByUserId(userId);
  }
}

