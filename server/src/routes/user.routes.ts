import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

const router = Router();

// Protected user routes
router.use(authMiddleware);

// Public routes
router.get('/home', getHomeData);

router.use(authorizeRoles('user'));

export default router;
