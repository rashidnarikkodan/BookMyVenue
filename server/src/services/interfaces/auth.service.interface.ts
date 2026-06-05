import { IUser } from '../../models/user.model';

export interface IAuthService {
  signup(userData: Partial<IUser>): Promise<{ email: string; registrationToken: string }>;
  googleAuth(idToken: string): Promise<{ user: Partial<IUser>; token: string }>;
  verifyOtp(registrationToken: string, otp: string): Promise<{ user: Partial<IUser>; token: string }>;
  resendOtp(registrationToken: string): Promise<void>;
}
