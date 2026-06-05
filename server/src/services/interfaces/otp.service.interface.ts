export interface IOtpService {
  generateAndSendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<void>;
  canResend(email: string): Promise<{ allowed: boolean; secondsLeft: number }>;
}
