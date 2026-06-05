import { Router } from 'express';
import { container } from '../configs/inversify.config';
import { AuthController } from '../controllers/auth.controller';
import { TYPES } from '../constants/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/signup', authController.signup);

export default router;
