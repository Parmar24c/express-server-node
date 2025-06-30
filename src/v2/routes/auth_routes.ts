// 1. IMPORTS
import { Router } from 'express';
import * as ctr  from '../controllers/auth_controller.js';

// 2. MAKE ROUTES
const router = Router();

// 3. PATHS
const Paths = {
    signup: '/signup',
    login: '/login',
};

// 4. DEFINE ROUTES
router.post(Paths.signup, ctr.signup);
router.post(Paths.login, ctr.login);

// 5. EXPORT ROUTER
export default router;
