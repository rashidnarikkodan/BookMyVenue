export interface RegisterDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
}
