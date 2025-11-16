import { Request, Response } from 'express';
import { FavoriteRepository } from '../repositories/FavoriteRepository';
import { AddToFavoritesUseCase } from '../use-cases/AddToFavoritesUseCase';
import { RemoveFromFavoritesUseCase } from '../use-cases/RemoveFromFavoritesUseCase';
import { ListFavoritesUseCase } from '../use-cases/ListFavoritesUseCase';
import { AppError } from '../../../shared/errors/AppError';

const favoriteRepository = new FavoriteRepository();
const addToFavoritesUseCase = new AddToFavoritesUseCase(favoriteRepository);
const removeFromFavoritesUseCase = new RemoveFromFavoritesUseCase(
  favoriteRepository
);
const listFavoritesUseCase = new ListFavoritesUseCase(favoriteRepository);

export class FavoriteController {
  async add(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      if (!productId) {
        return res.status(400).json({
          status: 'error',
          message: 'ID do produto é obrigatório',
        });
      }

      await addToFavoritesUseCase.execute(userId, productId);

      return res.json({
        status: 'success',
        message: 'Produto adicionado aos favoritos',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { productId } = req.params;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      await removeFromFavoritesUseCase.execute(userId, productId);

      return res.json({
        status: 'success',
        message: 'Produto removido dos favoritos',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const favorites = await listFavoritesUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: favorites,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      throw error;
    }
  }
}

