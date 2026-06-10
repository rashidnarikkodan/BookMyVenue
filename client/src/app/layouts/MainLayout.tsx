import { Footer, ProtectedNavbar } from '@/shared/components/layout';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export default function MainLayout() {
  return (
    <>
      <ThemeProvider>
        <ProtectedNavbar />

        <main>
          <Outlet />
        </main>

        <Footer />
      </ThemeProvider>
    </>
  );
}
