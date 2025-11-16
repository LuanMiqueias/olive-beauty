import { Request, Response } from 'express';
import { GetDashboardStatsUseCase } from '../use-cases/GetDashboardStatsUseCase';
import { GetTopProductsUseCase } from '../use-cases/GetTopProductsUseCase';
import { GetRevenueOverTimeUseCase } from '../use-cases/GetRevenueOverTimeUseCase';
import { GetOrdersOverTimeUseCase } from '../use-cases/GetOrdersOverTimeUseCase';
import { GetOrdersByStatusUseCase } from '../use-cases/GetOrdersByStatusUseCase';
import { GetSalesByCategoryUseCase } from '../use-cases/GetSalesByCategoryUseCase';

const getDashboardStatsUseCase = new GetDashboardStatsUseCase();
const getTopProductsUseCase = new GetTopProductsUseCase();
const getRevenueOverTimeUseCase = new GetRevenueOverTimeUseCase();
const getOrdersOverTimeUseCase = new GetOrdersOverTimeUseCase();
const getOrdersByStatusUseCase = new GetOrdersByStatusUseCase();
const getSalesByCategoryUseCase = new GetSalesByCategoryUseCase();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await getDashboardStatsUseCase.execute();
      return res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar estatísticas',
      });
    }
  }

  async getTopProducts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topProducts = await getTopProductsUseCase.execute(limit);
      return res.json({
        status: 'success',
        data: topProducts,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos mais vendidos',
      });
    }
  }

  async getRevenueOverTime(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const data = await getRevenueOverTimeUseCase.execute(days);
      return res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar receita ao longo do tempo',
      });
    }
  }

  async getOrdersOverTime(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const data = await getOrdersOverTimeUseCase.execute(days);
      return res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar pedidos ao longo do tempo',
      });
    }
  }

  async getOrdersByStatus(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const data = await getOrdersByStatusUseCase.execute(days);
      return res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar pedidos por status',
      });
    }
  }

  async getSalesByCategory(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const data = await getSalesByCategoryUseCase.execute(days);
      return res.json({
        status: 'success',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar vendas por categoria',
      });
    }
  }
}

