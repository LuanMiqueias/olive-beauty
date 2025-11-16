import { Request, Response } from 'express';
import { CartRepository } from '../repositories/CartRepository';
import { CartItemRepository } from '../repositories/CartItemRepository';
import { ProductVariantRepository } from '../../products/repositories/ProductVariantRepository';
import { AddItemToCartUseCase } from '../use-cases/AddItemToCartUseCase';
import { GetCartUseCase } from '../use-cases/GetCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../use-cases/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../use-cases/RemoveItemFromCartUseCase';
import { ClearCartUseCase } from '../use-cases/ClearCartUseCase';
import { addToCartSchema } from '../dtos/AddToCartDTO';
import { updateCartItemSchema } from '../dtos/UpdateCartItemDTO';
import { AppError } from '../../../shared/errors/AppError';

const cartRepository = new CartRepository();
const cartItemRepository = new CartItemRepository();
const productVariantRepository = new ProductVariantRepository();
const addItemToCartUseCase = new AddItemToCartUseCase(
  cartRepository,
  cartItemRepository,
  productVariantRepository
);
const getCartUseCase = new GetCartUseCase(cartRepository);
const updateCartItemQuantityUseCase = new UpdateCartItemQuantityUseCase(
  cartItemRepository,
  productVariantRepository
);
const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
  cartItemRepository
);
const clearCartUseCase = new ClearCartUseCase(cartRepository);

export class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const cart = await getCartUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: cart,
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

  async addItem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const validatedData = addToCartSchema.parse(req.body);
      await addItemToCartUseCase.execute(userId, validatedData);

      const cart = await getCartUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: cart,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { itemId } = req.params;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const validatedData = updateCartItemSchema.parse(req.body);
      await updateCartItemQuantityUseCase.execute(itemId, userId, validatedData);

      const cart = await getCartUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: cart,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Dados inválidos',
          errors: error,
        });
      }

      throw error;
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { itemId } = req.params;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      await removeItemFromCartUseCase.execute(itemId, userId);

      const cart = await getCartUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: cart,
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

  async clear(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      await clearCartUseCase.execute(userId);

      return res.json({
        status: 'success',
        message: 'Carrinho limpo com sucesso',
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

