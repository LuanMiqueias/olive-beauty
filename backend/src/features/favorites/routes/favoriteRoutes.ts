import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { authMiddleware } from '../../../shared/middleware/authMiddleware';

const router = Router();
const favoriteController = new FavoriteController();

router.get('/', authMiddleware, (req, res) =>
  favoriteController.list(req, res)
);
router.post('/', authMiddleware, (req, res) => favoriteController.add(req, res));
router.delete('/:productId', authMiddleware, (req, res) =>
  favoriteController.remove(req, res)
);

export default router;

