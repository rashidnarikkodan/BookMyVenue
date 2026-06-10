import {
  CreateCategoryDto,
  GetCategoriesQueryDto,
  UpdateCategoryDto,
} from '@/dto/category/category.dto';
import Category from '@/models/category.model';
import { CategoryDocument } from '@/types/category.types';

type Return = Promise<CategoryDocument | null>;

const createCategory = async (category: CreateCategoryDto): Return => {
  return await Category.create(category);
};
const updateCategory = async (category: UpdateCategoryDto): Return => {
  const { id, ...updates } = category;
  return await Category.findByIdAndUpdate(id, updates, { new: true });
};
const deleteCategory = async (id: string): Return => {
  return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

const getCategory = async (id: string): Return => {
  return await Category.findById(id);
};
export const getCategories = async (query: GetCategoriesQueryDto) => {
  const { status = 'active', search, sort = 'desc' } = query;

  const filter: any = {};

  if (status === 'active') {
    filter.isActive = true;
  } else if (status === 'inactive') {
    filter.isActive = false;
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i',
    };
  }

  const sortOption: any = {
    createdAt: sort === 'asc' ? 1 : -1,
  };

  return await Category.find(filter).sort(sortOption);
};
const getCategoryByName = async (name: string): Return => {
  return await Category.findOne({ name });
};

const restoreCategory = async (id: string): Return => {
  return await Category.findByIdAndUpdate(id, { isActive: true }, { new: true });
};
const getCategoryImageId = async (id:string): Return => {
  return await Category.findOne({_id:id},{image_public_id:1});
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategory,
  getCategories,
  getCategoryByName,
  getCategoryImageId,
};
