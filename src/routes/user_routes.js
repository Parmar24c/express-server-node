// 1. IMPORTS
import { Router } from 'express';
import { verifyToken } from '../middleware/auth_middleware.js';
import * as ctr from '../controllers/user_controller.js'; // HERE CTR IS ALIAS SO WE DONT HAVE TO IMPORT ALL FUNCTION MANUALLY NAMED

// 2. MAKE ROUTES INSTANCE
const router = Router();

// 3. PATHS
const Paths = {
    getAll: '/',
    getById: '/:id',
    getActive: '/active',
    update: '/update/:id',
    updateActive: '/active_status/:id',
    delete: '/delete/:id',
    changePassword: '/change_password/:id',
};

// 4. ROUTES DEFINE WITH VERIFYTOKEN
router.get(Paths.getAll, verifyToken, ctr.getAllUsers);
router.get(Paths.getActive, verifyToken, ctr.getActiveUsers);
router.get(Paths.getById, verifyToken, ctr.getUserById);
router.post(Paths.update, verifyToken, ctr.updateUserDetails);
router.post(Paths.updateActive, verifyToken, ctr.updateActiveStatus);
router.post(Paths.delete, verifyToken, ctr.deleteUser);
router.post(Paths.changePassword, verifyToken, ctr.changePassword);

// 5. EXPORT ROUTER
export default router;
