import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { AUTH_ROUTES } from '../../constants/apiRoutes';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(AUTH_ROUTES.SIGNUP, formData);
      setSuccess(true);

      //redirect into signin
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 text-center">
        <h2 className="text-lg font-semibold text-white tracking-tight">Create Account</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Join our premium venue dashboard</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-4">
          Account created successfully! You can now log in.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
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
            className="w-full bg-[#0f172a]/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="w-full bg-[#0f172a]/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
          />
        </div>

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
            className="w-full bg-[#0f172a]/50 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
          />
        </div>

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
              title="Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character."
              className="w-full bg-[#0f172a]/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

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
              className="w-full bg-[#0f172a]/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center transition-all group disabled:opacity-50"
        >
          {loading ? 'SIGNING UP...' : 'CREATE ACCOUNT'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/signin" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
          Sign In
        </Link>
      </div>
    </>
  );
};

export default Signup;
