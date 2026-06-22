import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import * as userController from '@/controllers/user.controller';
import * as adminVenueController from '@/controllers/admin-venue.controller';
import { upload } from '@/middlewares/upload.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { validateInputs, validateObjectId, validateQuery } from '@/middlewares/validate.middleware';
import { getAdminVenuesQuerySchema } from '@/dto/admin/get-venues.dto';
import { rejectVenueSchema } from '@/dto/admin/reject-venue.dto';

const router = Router();

// Protect all admin routes
router.use(authMiddleware, authorizeRoles('admin'));

// Categories
router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(upload.single('image'), categoryController.createCategory);

router
  .route('/categories/:id')
  .get(categoryController.getCategory)
  .patch(upload.single('image'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/categories/:id/restore').patch(categoryController.restoreCategory);

// Users
router.route('/users').get(userController.getUsers);
router.route('/users/:id').get(userController.getUser);
router.route('/users/:id/block').patch(userController.blockUser);
router.route('/users/:id/unblock').patch(userController.unblockUser);

// Venues
router
  .route('/venues')
  .get(validateQuery(getAdminVenuesQuerySchema), adminVenueController.getAdminVenues);

router.route('/venues/:id').all(validateObjectId('id')).get(adminVenueController.getAdminVenueById);

router
  .route('/venues/:id/approve')
  .all(validateObjectId('id'))
  .patch(adminVenueController.approveVenue);

router
  .route('/venues/:id/reject')
  .all(validateObjectId('id'))
  .patch(validateInputs(rejectVenueSchema), adminVenueController.rejectVenue);

export default router;
