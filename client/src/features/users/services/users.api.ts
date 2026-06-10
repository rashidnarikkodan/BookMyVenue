import type { User, UserQuery } from '../types';

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
    isActive: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'owner',
    isActive: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'admin',
    isActive: true,
    imageUrl: null,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'u4',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'user',
    isActive: false,
    imageUrl: null,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const loadMockUsers = (): User[] => {
  const stored = localStorage.getItem('bmv_mock_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback
    }
  }
  return mockUsers;
};

const saveMockUsers = (users: User[]) => {
  localStorage.setItem('bmv_mock_users', JSON.stringify(users));
};

export const usersApi = {
  getAll: async (
    query: UserQuery
  ): Promise<{ success: boolean; message: string; data: User[] }> => {
    await new Promise((r) => setTimeout(r, 400));
    let list = loadMockUsers();

    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      );
    }
    if (query.status && query.status !== 'all') {
      const active = query.status === 'active';
      list = list.filter((u) => u.isActive === active);
    }
    if (query.role && query.role !== 'all') {
      list = list.filter((u) => u.role === query.role);
    }

    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return query.sort === 'asc' ? da - db : db - da;
    });

    return { success: true, message: 'Users retrieved successfully', data: list };
  },

  getById: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = loadMockUsers();
    const user = list.find((u) => u.id === id || u._id === id);
    if (!user) throw new Error('User not found');
    return { success: true, message: 'User retrieved successfully', data: user };
  },

  create: async (
    formData: FormData
  ): Promise<{ success: boolean; message: string; data: User }> => {
    await new Promise((r) => setTimeout(r, 500));
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'owner' | 'user';
    const image = formData.get('image') as File | null;

    const list = loadMockUsers();
    if (list.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered');
    }

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      isActive: true,
      imageUrl: image ? URL.createObjectURL(image) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.push(newUser);
    saveMockUsers(list);
    return { success: true, message: 'User created successfully', data: newUser };
  },

  update: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; message: string; data: User }> => {
    await new Promise((r) => setTimeout(r, 500));
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'owner' | 'user';
    const image = formData.get('image') as File | null;

    const list = loadMockUsers();
    const userIndex = list.findIndex((u) => u.id === id || u._id === id);
    if (userIndex === -1) throw new Error('User not found');

    if (list.some((u, i) => i !== userIndex && u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered to another user');
    }

    const existingUser = list[userIndex];
    const updatedUser: User = {
      ...existingUser,
      name,
      email,
      role,
      imageUrl: image ? URL.createObjectURL(image) : existingUser.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    list[userIndex] = updatedUser;
    saveMockUsers(list);
    return { success: true, message: 'User updated successfully', data: updatedUser };
  },

  remove: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = loadMockUsers();
    const userIndex = list.findIndex((u) => u.id === id || u._id === id);
    if (userIndex === -1) throw new Error('User not found');

    list[userIndex].isActive = false;
    list[userIndex].updatedAt = new Date().toISOString();
    saveMockUsers(list);
    return { success: true, message: 'User disabled successfully', data: list[userIndex] };
  },

  restore: async (id: string): Promise<{ success: boolean; message: string; data: User }> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = loadMockUsers();
    const userIndex = list.findIndex((u) => u.id === id || u._id === id);
    if (userIndex === -1) throw new Error('User not found');

    list[userIndex].isActive = true;
    list[userIndex].updatedAt = new Date().toISOString();
    saveMockUsers(list);
    return { success: true, message: 'User restored successfully', data: list[userIndex] };
  },
};
