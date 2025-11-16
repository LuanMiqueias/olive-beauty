import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { AppError } from '../../../shared/errors/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AddToFavoritesUseCase {
  constructor(private favoriteRepository: FavoriteRepository) {}

  async execute(userId: string, productId: string) {
    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    // Check if already favorited
    const existing = await this.favoriteRepository.findByUserAndProduct(
      userId,
      productId
    );

    if (existing) {
      throw new AppError('Produto já está nos favoritos', 409);
    }

    return this.favoriteRepository.create(userId, productId);
  }
}

