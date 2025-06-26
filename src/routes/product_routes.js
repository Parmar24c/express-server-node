// 1. IMPORTS
import { Router } from 'express';
import { verifyToken } from '../middleware/auth_middleware.js';
import * as ctr from '../controllers/product_controller.js';

// 2. MAKE ROUTES INSTANCE
const router = Router();

// 3. ROUTE PATHS
const Paths = {
  getAll: '/',
  getById: '/:id',
  add: '/add',
  update: '/update/:id',
  updateActive: '/active_status/:id',
  delete: '/delete/:id',
};

// 4. ROUTES DEFINE WITH TOKEN PROTECTION
router.get(Paths.getAll, verifyToken, ctr.getAllProducts);
router.get(Paths.getById, verifyToken, ctr.getProductById);

router.post(Paths.add, verifyToken, ctr.addProduct);
router.post(Paths.update, verifyToken, ctr.updateProduct);
router.post(Paths.updateActive, verifyToken, ctr.updateActiveStatus);
router.post(Paths.delete, verifyToken, ctr.deleteProduct);

// 5. EXPORT ROUTER
export default router;
