import { Request, Response, NextFunction } from 'express';
import * as categoryService from '@/services/category.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';

// CREATE
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image } = req.body;

    if (!name || typeof name !== 'string') {
      throw new Error('Name is required');
    }

    const category = await categoryService.createCategory({
      name,
      description,
      image,
    });

    return success(res, HTTP_STATUS.CREATED, category, 'New Category created');
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image } = req.body;

    const category = await categoryService.updateCategory({
      id: req.params.id as string,
      name,
      description,
      image,
    });

    return success(res, HTTP_STATUS.OK, category, 'Category updated');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category deleted');
  } catch (error) {
    next(error);
  }
};

// RESTORE
export const restoreCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.restoreCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category restored');
  } catch (error) {
    next(error);
  }
};

// SINGLE GET
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategory(req.params.id as string);

    return success(res, HTTP_STATUS.OK, category, 'Category fetched');
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategories(req.query);

    return success(res, HTTP_STATUS.OK, categories, 'Categories fetched');
  } catch (error) {
    next(error);
  }
};
