import { IUser } from '../../models/user.model';

export interface IAuthService {
  signup(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }>;
}
