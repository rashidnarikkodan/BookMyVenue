import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import * as userController from '@/controllers/user.controller';
import { upload } from '@/middlewares/upload.middleware';

const router = Router();

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

export default router;
