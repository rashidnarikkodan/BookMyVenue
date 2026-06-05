import { injectable } from 'inversify';
import User, { IUser } from '../models/user.model';
import { IUserRepository } from './interfaces/user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
}
