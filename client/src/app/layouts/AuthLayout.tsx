import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Toaster } from 'sonner';
import SuspenseLoader from '@/shared/components/ui/SuspenseLoader';

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 relative">
        <Toaster richColors position="top-center" />

        {/* Background ambient light effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]"></div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Logo Section */}
            <div className="mb-2 text-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white mb-1 mx-auto font-bold text-lg shadow-lg shadow-primary/20">
                B
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">BookMyVenue</h1>
            </div>

            {/* Form Container */}
            <div className="w-full bg-surface/80 backdrop-blur-xl rounded-2xl border border-border p-5 shadow-2xl">
              <Suspense fallback={<SuspenseLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-5xl mx-auto mt-2 pt-2 border-t border-border flex flex-col md:flex-row items-center justify-between text-[11px] text-foreground/70">
          <div className="mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} BookMyVenue. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-foreground/45 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground/45 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground/45 transition-colors">
              Contact Support
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
