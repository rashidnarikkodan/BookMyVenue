import { ownerDashboardController } from '@/controllers/dashboard.controller';
import { Router } from 'express';

const router = Router();

router.get('/dashboard', ownerDashboardController);

export default router;
