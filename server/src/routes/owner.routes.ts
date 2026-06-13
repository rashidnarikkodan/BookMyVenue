import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import * as venueController from '@/controllers/venue.controller';
import { validateInputs, validateObjectId, validateQuery } from '@/middlewares/validate.middleware';
import { upload } from '@/middlewares/upload.middleware';
import { createVenueSchema } from '@/dto/venue/create-venue.dto';
import { updateVenueSchema } from '@/dto/venue/update-venue.dto';
import { getOwnerVenuesQuerySchema } from '@/dto/venue/get-owner-venues.dto';

const router = Router();

// Protect all owner routes
router.use(authMiddleware, authorizeRoles('owner'));

// POST   /owners/venues       - Create a new venue
// GET    /owners/venues       - List all owner's venues (with pagination, search, filter, sort)
router
  .route('/venues')
  .post(upload.array('images', 10), validateInputs(createVenueSchema), venueController.createVenue)
  .get(validateQuery(getOwnerVenuesQuerySchema), venueController.getOwnerVenues);

// GET    /owners/venues/:id   - Get a single venue
// PATCH  /owners/venues/:id   - Update a venue
router
  .route('/venues/:id')
  .all(validateObjectId('id'))
  .get(venueController.getVenueById)
  .patch(upload.array('images', 10), validateInputs(updateVenueSchema), venueController.updateVenue);

export default router;
