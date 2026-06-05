import { Footer } from '@/shared/components/layout';
import Navbar from '@/shared/components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export default function MainLayout() {
  throw new Error('any')
  return (
    <>
      <ThemeProvider>
        <Navbar />

        <main>
          <Outlet />
        </main>

        <Footer />
      </ThemeProvider>
    </>
  );
}
