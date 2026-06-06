import User from '../models/user.model';
import { IUser } from '../models/interfaces/user-scheme.interface';
import { IUserRepository } from './interfaces/user.repository.interface';

export const userRepository: IUserRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  },

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  },

  async update(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  },

  async deleteById(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  },
};
