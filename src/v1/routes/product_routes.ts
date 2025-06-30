// 1. IMPORTS
import { Router } from 'express';
import { verifyToken } from '../../common/middleware/auth_middleware';
import * as ctr from '../controllers/product_controller';
import validateBody from '../../common/middleware/validate_body';
import { addProductValidator, filterProductValidator, updateProductValidator } from '../model_validators/product_validator';

// 2. MAKE ROUTES INSTANCE
const router = Router();

// 3. ROUTE PATHS
const Paths = {
  getAll: '/',
  getFiltered: '/filtered',
  getById: '/:id',
  add: '/add',
  update: '/update/:id',
  updateActive: '/active_status/:id',
  delete: '/delete/:id',
};

// 4. ROUTES DEFINE WITH TOKEN PROTECTION
router.get(Paths.getAll, verifyToken, ctr.getAllProducts);
router.get(Paths.getFiltered, verifyToken, validateBody(filterProductValidator), ctr.getFilteredProducts);
router.get(Paths.getById, verifyToken, ctr.getProductById);

router.post(Paths.add, verifyToken, validateBody(addProductValidator), ctr.addProduct);
router.post(Paths.update, verifyToken, validateBody(updateProductValidator), ctr.updateProduct);
router.post(Paths.updateActive, verifyToken, ctr.updateActiveStatus);
router.post(Paths.delete, verifyToken, ctr.deleteProduct);

// 5. EXPORT ROUTER
export default router;
