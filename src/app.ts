import express, { Application } from 'express';
import { customResponseMiddleware } from './middleware/response_middleware';
import authRoutes from './routes/auth_routes';
import userRoutes from './routes/user_routes';
import categoryRoutes from './routes/category_routes';
import productRoutes from './routes/product_routes';

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(customResponseMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);

export default app;
