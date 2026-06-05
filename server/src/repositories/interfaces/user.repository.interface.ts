import { IUser } from '../../models/user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteById(userId: string): Promise<void>;
}
