import { OwnerNavbar, OwnerSidebar } from '@/shared/components/layout';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

export default function OwnerLayout() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <OwnerSidebar />

        {/* Content panel */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <OwnerNavbar />

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
