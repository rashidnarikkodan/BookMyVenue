import { Router } from 'express';

import { ownerDashboardController } from '@/controllers/dashboard.controller';
import * as venueController from '@/controllers/venue.controller';

import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import {
  validateObjectId,
  validateQuery,
} from '@/middlewares/validate.middleware';

import { upload } from '@/middlewares/upload.middleware';
import { getOwnerVenuesQuerySchema } from '@/dto/venue/get-owner-venues.dto';

const router = Router();

// Owner-only routes
router.use(authMiddleware, authorizeRoles('owner'));

// Dashboard
router.get('/dashboard', ownerDashboardController);

// Venues
router
  .route('/venues')
  .post(upload.array('images', 10), venueController.createVenue)
  .get(
    validateQuery(getOwnerVenuesQuerySchema),
    venueController.getOwnerVenues
  );

router
  .route('/venues/:id')
  .all(validateObjectId('id'))
  .get(venueController.getVenueById)
  .patch(
    upload.array('images', 10),
    venueController.updateVenue
  );

export default router;
