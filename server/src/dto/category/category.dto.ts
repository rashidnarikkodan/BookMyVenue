export interface CreateCategoryDto {
  name: string;
  description: string;
  image: string;
}
export interface UpdateCategoryDto {
  id: string;
  name?: string;
  description?: string;
  image?: string;
}
export interface CategoryResponseDto {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface GetCategoriesQueryDto {
  status?: 'active' | 'inactive' | 'all';
  search?: string;
  sort?: 'asc' | 'desc';
}
