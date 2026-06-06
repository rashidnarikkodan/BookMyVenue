// category.service.ts

import repo from '@/repositories/category.repository';

import {
  CategoryResponseDto,
  CreateCategoryDto,
  GetCategoriesQueryDto,
  UpdateCategoryDto,
} from '@/dto/category/category.dto';
import { AppError } from '@/utils/AppError';
import { CategoryDocument } from '@/types/category.types';
import { HTTP_STATUS } from '@/constants/http';
import mongoose from 'mongoose';

type Return = Promise<CategoryDocument | null>;

export const createCategory = async (data: CreateCategoryDto): Return => {
  const existingCategory = await repo.getCategoryByName(data.name);

  if (existingCategory) {
    throw new AppError('Category already exists', HTTP_STATUS.CONFLICT);
  }

  return await repo.createCategory(data);
};

export const updateCategory = async (data: UpdateCategoryDto): Return => {

  const category = await repo.getCategory(data.id);

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  if (data.name) {
    const existingCategory = await repo.getCategoryByName(data.name);

    if (existingCategory && existingCategory.id.toString() !== data.id) {
      throw new AppError('Category name already exists', HTTP_STATUS.CONFLICT);
    }
  }

  return await repo.updateCategory(data);
};

export const deleteCategory = async (id: string): Return => {

  if (typeof id !== 'string') throw new AppError('Invalid Category ID', HTTP_STATUS.BAD_REQUEST);
  const category = await repo.getCategory(id);

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  return await repo.deleteCategory(id);
};

export const restoreCategory = async (id: string): Return => {

  const category = await repo.getCategory(id);

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  return await repo.restoreCategory(id);
};

export const getCategory = async (id: string): Return => {

  const category = await repo.getCategory(id);

  if (!category) {
    throw new AppError('Category not found', HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

export const getCategories = async (query: GetCategoriesQueryDto): Promise<CategoryDocument[]> => {
  return await repo.getCategories(query);
};
