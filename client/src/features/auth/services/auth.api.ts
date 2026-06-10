export const resendOtpApi = async (_token: string): Promise<any> => {
  return { success: true, message: 'OTP resent successfully' };
};

export const verifyOtpApi = async (_token: string, _otp: string): Promise<any> => {
  return { success: true, data: { message: 'Verification successful' } };
};

export const googleAuthApi = async (_token: string): Promise<any> => {
  return { success: true, data: { user: { name: 'Google User' }, token: 'mock-google-token' } };
};

export const signinApi = async (credentials: any): Promise<any> => {
  return {
    success: true,
    data: { user: { name: 'John Doe', email: credentials.email }, token: 'mock-session-token' },
  };
};

export const signupApi = async (details: any): Promise<any> => {
  return { success: true, data: { email: details.email, token: 'mock-registration-token' } };
};
