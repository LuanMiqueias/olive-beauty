import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { adminMiddleware } from '../../../shared/middleware/adminMiddleware';

const router = Router();
const dashboardController = new DashboardController();

router.get(
  '/stats',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getStats(req, res)
);
router.get(
  '/top-products',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getTopProducts(req, res)
);
router.get(
  '/revenue-over-time',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getRevenueOverTime(req, res)
);
router.get(
  '/orders-over-time',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getOrdersOverTime(req, res)
);
router.get(
  '/orders-by-status',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getOrdersByStatus(req, res)
);
router.get(
  '/sales-by-category',
  authMiddleware,
  adminMiddleware,
  (req, res) => dashboardController.getSalesByCategory(req, res)
);

export default router;

