import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';

const router = Router();

router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route('/categories/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/categories/:id/restore').patch(categoryController.restoreCategory);

export default router;
