import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Toaster } from 'sonner';

export default function AuthLayout() {
  return (
    <>
      <ThemeProvider>
        <Toaster richColors position="top-center" />
        <div className="min-h-screen flex items-center justify-center">
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  );
}
