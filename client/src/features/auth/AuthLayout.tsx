import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4">
      {/* Background ambient light effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-600/10 text-red-500 mb-4 mx-auto font-bold text-2xl">
            B
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">BookMyVenue</h1>
          <p className="text-xs text-slate-400">The elite venue management partner</p>
        </div>

        {/* Form Container */}
        <div className="w-full bg-[#1e293b]/80 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
          <Outlet />
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-xs text-slate-500 flex items-center justify-between w-full px-4">
          <span>&copy; 2024 BookMyVenue</span>
          <div className="space-x-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
