import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './features/auth/routes/authRoutes';
import categoryRoutes from './features/categories/routes/categoryRoutes';
import productRoutes from './features/products/routes/productRoutes';
import cartRoutes from './features/cart/routes/cartRoutes';
import favoriteRoutes from './features/favorites/routes/favoriteRoutes';
import orderRoutes from './features/orders/routes/orderRoutes';
import dashboardRoutes from './features/dashboard/routes/dashboardRoutes';
import { errorHandler } from './shared/middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Olive Beauty API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

