import {Router} from 'express';
import {getEliteVenues} from '@/controllers/home.controller';

const router = Router();

router.get('/elite-venues', getEliteVenues);

export default router;