import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export default function AuthLayout() {
  return (
    <>
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  );
}
