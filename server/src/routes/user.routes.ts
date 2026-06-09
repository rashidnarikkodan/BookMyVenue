import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';

const router = Router();

router.get('/home', getHomeData);

export default router;
