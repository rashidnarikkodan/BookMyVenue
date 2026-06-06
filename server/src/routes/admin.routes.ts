import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import { validateObjectId } from '@/middlewares/validate.middleware';

const router = Router();

router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route('/categories/:id')
  .all(validateObjectId('id'))
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/categories/:id/restore').patch(categoryController.restoreCategory);

export default router;
