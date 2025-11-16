import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';
import { adminMiddleware } from '../../../shared/middleware/adminMiddleware';

const router = Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', (req, res) => categoryController.list(req, res));
router.get('/:id', (req, res) => categoryController.getById(req, res));

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  (req, res) => categoryController.create(req, res)
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  (req, res) => categoryController.update(req, res)
);
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  (req, res) => categoryController.delete(req, res)
);

export default router;

