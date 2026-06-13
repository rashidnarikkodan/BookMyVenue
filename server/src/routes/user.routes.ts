import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

const router = Router();

router.get('/home', getHomeData);
// Protected user routes
router.use(authMiddleware);

// Public routes

router.use(authorizeRoles('user'));

export default router;
