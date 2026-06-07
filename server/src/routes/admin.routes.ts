import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import { validateObjectId } from '@/middlewares/validate.middleware';
import { upload } from '@/middlewares/upload.middleware';

const router = Router();

router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(upload.single('image'), categoryController.createCategory);

router
  .route('/categories/:id')
  .all(validateObjectId('id'))
  .get(categoryController.getCategory)
  .patch(upload.single('image'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/categories/:id/restore').patch(categoryController.restoreCategory);

export default router;

