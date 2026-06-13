export interface ISignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
}

export interface ISigninData {
  email: string;
  password?: string;
}
