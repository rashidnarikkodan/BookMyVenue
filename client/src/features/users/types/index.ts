export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  password?: string;
  image?: File | null;
}

export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'owner' | 'user';
  password?: string;
  image?: File | null;
}

export interface UserQuery {
  search?: string;
  sort?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'all';
  role?: 'all' | 'admin' | 'owner' | 'user';
}
