import express from 'express';
import { connectDB } from './config/db.js';
import { customResponseMiddleware } from './middleware/response_middleware.js';

import authRoutes from './routes/auth_routes.js';
import userRoutes from './routes/user_routes.js';
import categoryRoutes from './routes/category_routes.js';
import productRoutes from './routes/product_routes.js';

import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(customResponseMiddleware);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

