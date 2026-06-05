import { IUser } from '../../models/user.model';

export interface IAuthService {
  signup(userData: Partial<IUser>): Promise<{ email: string; registrationToken: string }>;
  signin(data: any): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }>;
  googleAuth(idToken: string): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }>;
  verifyOtp(registrationToken: string, otp: string): Promise<{ user: Partial<IUser>; token: string; refreshToken: string }>;
  resendOtp(registrationToken: string): Promise<void>;
}
