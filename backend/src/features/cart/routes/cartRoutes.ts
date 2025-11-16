import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();
const cartController = new CartController();

router.get('/', authMiddleware, (req, res) => cartController.getCart(req, res));
router.post('/items', authMiddleware, (req, res) =>
  cartController.addItem(req, res)
);
router.put('/items/:itemId', authMiddleware, (req, res) =>
  cartController.updateItem(req, res)
);
router.delete('/items/:itemId', authMiddleware, (req, res) =>
  cartController.removeItem(req, res)
);
router.delete('/', authMiddleware, (req, res) =>
  cartController.clear(req, res)
);

export default router;

