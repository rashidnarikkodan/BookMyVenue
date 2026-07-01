import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { getProfile, updateProfile, getUserBookings } from '@/controllers/user.controller';
import { upload } from '@/middlewares/upload.middleware';

const router = Router();

router.get('/home', getHomeData);
// Protected user routes
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put(
  '/profile',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  updateProfile
);
router.get('/bookings', getUserBookings);

// Public routes

router.use(authorizeRoles('user'));

export default router;
