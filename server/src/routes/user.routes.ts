import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, authorizeRoles('user'));

router.get('/home', getHomeData);

export default router;
