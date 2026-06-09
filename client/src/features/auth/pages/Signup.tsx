import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signupApi, googleAuthApi } from '../services/auth.api';
import { useAuthStore } from '../store/auth.store';
import { useAppStore } from '../../../store/app.store';
import OtpVerification from './OtpVerification';
import { GoogleLogin } from "@react-oauth/google";

const getRoleRedirect = (role: string) => {
  if (role === 'owner') return '/owner/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
};

const Signup = () => {
  const navigate = useNavigate();
  const { signupStep, setRegistrationData, resetSignupFlow } = useAuthStore();
  const setAuth = useAppStore((state) => state.setAuth);

  React.useEffect(() => {
    resetSignupFlow();
    return () => {
      resetSignupFlow();
    };
  }, [resetSignupFlow]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await signupApi({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setRegistrationData(data.data.email, data.data.registrationToken);
    } catch (err: any) {
      let msg = 'Something went wrong';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth signup
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await googleAuthApi(credentialResponse.credential);

      console.log('Google auth success', data);
      setAuth(data.data.token, data.data.refreshToken, data.data.user);
      navigate(getRoleRedirect(data.data.user.role));
    } catch (error) {
      console.log("Google auth Error: ", error);
      setError('Google Auth Failed');
    } finally {
      setLoading(false);
    }
  };

  // OTP verified
  const handleOtpSuccess = () => {
    resetSignupFlow();
    navigate('/signin');
  };

  if (signupStep === 'otp') {
    return <OtpVerification onSuccess={handleOtpSuccess} />;
  }

  return (
    <>
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-white tracking-tight">Create Account</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Join our premium venue dashboard</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">FULL NAME</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            minLength={3}
            className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">PHONE NUMBER</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
            pattern="^\+?[1-9]\d{1,14}$"
            title="Please enter a valid phone number, e.g. +1234567890"
            className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">PASSWORD</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
              title="Min 8 chars with uppercase, lowercase, number and special character."
              className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">CONFIRM PASSWORD</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center transition-all group disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              SENDING OTP…
            </>
          ) : (
            <>
              CREATE ACCOUNT
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-1">
          <div className="flex-grow border-t border-slate-700/60"></div>
          <span className="px-3 text-[10px] text-slate-500 uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-slate-700/60"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_black"
            text="continue_with"
            width="100%"
          />
        </div>
      </form>

      <div className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/signin" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    </>
  );
};

export default Signup;
