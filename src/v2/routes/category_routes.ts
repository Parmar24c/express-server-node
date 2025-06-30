// 1. IMPORTS
import { Router } from 'express';
import { verifyToken } from '../../common/middleware/auth_middleware.js';
import * as ctr from '../controllers/category_controller.js'; // HERE CTR IS ALIAS SO WE DONT HAVE TO IMPORT ALL FUNCTION MANUALLY NAMED

// 2. MAKE ROUTES INSTANCE
const router = Router();

// 3. PATHS
const Paths = {
    getAll: '/',
    getById: '/:id',
    add: '/add',
    activeStatus: '/active_status/:id',
    update: '/update/:id',
    delete: '/delete/:id',
};

// 4. ROUTES DEFINE WITH VERIFYTOKEN
router.get(Paths.getAll, verifyToken, ctr.getAllCategories);
router.get(Paths.getById, verifyToken, ctr.getCategoryById);

router.post(Paths.add, verifyToken, ctr.addCategory);
router.post(Paths.activeStatus, verifyToken, ctr.updateActiveStatus);
router.post(Paths.update, verifyToken, ctr.updateCategory);
router.post(Paths.delete, verifyToken, ctr.deleteCategory);

// 5. EXPORT ROUTER
export default router;
