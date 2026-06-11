import { Footer, ProtectedNavbar, PublicNavbar } from '@/shared/components/layout';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useAppStore } from '@/store/app.store';

export default function MainLayout() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return (
    <>
      <ThemeProvider>
        {isAuthenticated ? <ProtectedNavbar /> : <PublicNavbar />}

        <main>
          <Outlet />
        </main>

        <Footer />
      </ThemeProvider>
    </>
  );
}
