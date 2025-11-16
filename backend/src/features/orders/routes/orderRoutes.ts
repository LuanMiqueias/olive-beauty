import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { adminMiddleware } from '../../../shared/middleware/adminMiddleware';

const router = Router();
const orderController = new OrderController();

// User routes
router.post('/', authMiddleware, (req, res) => orderController.create(req, res));
router.get('/my-orders', authMiddleware, (req, res) =>
  orderController.listUserOrders(req, res)
);
router.get('/:id', authMiddleware, (req, res) =>
  orderController.getById(req, res)
);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, (req, res) =>
  orderController.listAll(req, res)
);
router.put('/:id/status', authMiddleware, adminMiddleware, (req, res) =>
  orderController.updateStatus(req, res)
);

export default router;

