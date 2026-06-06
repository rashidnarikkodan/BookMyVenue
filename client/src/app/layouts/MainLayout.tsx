import { Footer } from '@/shared/components/layout';
import Navbar from '@/shared/components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Toaster } from 'sonner';

export default function MainLayout() {
  return (
    <>
      <ThemeProvider>
        <Toaster richColors position="top-right" />
        <Navbar />

        <main>
          <Outlet />
        </main>

        <Footer />
      </ThemeProvider>
    </>
  );
}
