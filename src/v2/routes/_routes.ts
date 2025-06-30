import { Router } from "express";
import authRoutes from './auth_routes';
import userRoutes from './user_routes';
import categoryRoutes from './category_routes';
import productRoutes from './product_routes';
import uploadRoutes from './upload_routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.use('/upload', uploadRoutes);


export default router ;
