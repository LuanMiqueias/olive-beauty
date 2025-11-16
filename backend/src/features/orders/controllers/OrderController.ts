import { Request, Response } from 'express';
import { OrderRepository } from '../repositories/OrderRepository';
import { OrderItemRepository } from '../repositories/OrderItemRepository';
import { CartRepository } from '../../cart/repositories/CartRepository';
import { ProductVariantRepository } from '../../products/repositories/ProductVariantRepository';
import { CreateOrderUseCase } from '../use-cases/CreateOrderUseCase';
import { ListUserOrdersUseCase } from '../use-cases/ListUserOrdersUseCase';
import { GetOrderByIdUseCase } from '../use-cases/GetOrderByIdUseCase';
import { ListAllOrdersUseCase } from '../use-cases/ListAllOrdersUseCase';
import { UpdateOrderStatusUseCase } from '../use-cases/UpdateOrderStatusUseCase';
import { createOrderSchema } from '../dtos/CreateOrderDTO';
import { updateOrderStatusSchema } from '../dtos/UpdateOrderStatusDTO';
import { AppError } from '../../../shared/errors/AppError';

const orderRepository = new OrderRepository();
const orderItemRepository = new OrderItemRepository();
const cartRepository = new CartRepository();
const productVariantRepository = new ProductVariantRepository();
const createOrderUseCase = new CreateOrderUseCase(
  orderRepository,
  orderItemRepository,
  cartRepository,
  productVariantRepository
);
const listUserOrdersUseCase = new ListUserOrdersUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
const listAllOrdersUseCase = new ListAllOrdersUseCase(orderRepository);
const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const validatedData = createOrderSchema.parse(req.body);
      const order = await createOrderUseCase.execute(userId, validatedData);

      return res.status(201).json({
        status: 'success',
        data: order,
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

  async listUserOrders(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Não autenticado',
        });
      }

      const orders = await listUserOrdersUseCase.execute(userId);

      return res.json({
        status: 'success',
        data: orders,
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === 'ADMIN';

      const order = await getOrderByIdUseCase.execute(id, userId);

      // Verify ownership unless admin
      if (!isAdmin && order.userId !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Acesso negado',
        });
      }

      return res.json({
        status: 'success',
        data: order,
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

  async listAll(req: Request, res: Response) {
    try {
      const orders = await listAllOrdersUseCase.execute();

      return res.json({
        status: 'success',
        data: orders,
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

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateOrderStatusSchema.parse(req.body);
      const order = await updateOrderStatusUseCase.execute(id, validatedData);

      return res.json({
        status: 'success',
        data: order,
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
}

