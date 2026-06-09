import { Request, Response, NextFunction } from 'express';
import * as categoryService from '@/services/category.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';
import { uploadToCloudinary } from '@/libs/cloudinary';
import fs from 'fs/promises';

// CREATE
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  let tempFilePath = req.file?.path;
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string') {
      throw new Error('Name is required');
    }

    let imageUrl: string | undefined;
    let image_public_id: string | undefined;

    if (tempFilePath) {
      const uploadResult = await uploadToCloudinary(tempFilePath);
      imageUrl = uploadResult.url;
      image_public_id = uploadResult.public_id;

      await fs.unlink(tempFilePath).catch(() => {});
      tempFilePath = undefined;
    }

    const category = await categoryService.createCategory({
      name,
      description,
      imageUrl,
      image_public_id,
    });

    return success(res, HTTP_STATUS.CREATED, category, 'New Category created');
  } catch (error) {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
    next(error);
  }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  let tempFilePath = req.file?.path;
  try {
    const { name, description } = req.body;

    let imageUrl: string | undefined;
    let image_public_id: string | undefined;

    if (tempFilePath) {
      const uploadResult = await uploadToCloudinary(tempFilePath);
      imageUrl = uploadResult.url;
      image_public_id = uploadResult.public_id;

      await fs.unlink(tempFilePath).catch(() => {});
      tempFilePath = undefined;
    }

    const category = await categoryService.updateCategory({
      id: req.params.id as string,
      name,
      description,
      imageUrl,
      image_public_id,
    });

    return success(res, HTTP_STATUS.OK, category, 'Category updated');
  } catch (error) {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch(() => {});
    }
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
