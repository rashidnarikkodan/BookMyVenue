import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/home', getHomeData);

// Protected user routes
router.use(authMiddleware, authorizeRoles('user'));

export default router;
