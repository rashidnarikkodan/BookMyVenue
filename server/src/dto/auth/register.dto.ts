import { ROLES } from '@/constants/roles'
export interface RegisterDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  role: 'user' | 'owner' | 'admin'
}