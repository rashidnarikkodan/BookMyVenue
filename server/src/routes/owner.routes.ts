import { Router, Request, Response } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, authorizeRoles('owner'));

export default router;
