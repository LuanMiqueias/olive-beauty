import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { adminMiddleware } from '../../../shared/middleware/adminMiddleware';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', (req, res) => productController.list(req, res));
router.get('/:id', (req, res) => productController.getById(req, res));

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  (req, res) => productController.create(req, res)
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  (req, res) => productController.update(req, res)
);
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  (req, res) => productController.delete(req, res)
);

export default router;

