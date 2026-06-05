import { IUser } from '../../models/user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
}
