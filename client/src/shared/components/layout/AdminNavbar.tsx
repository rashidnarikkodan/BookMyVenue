import {
  Bell,
  Search,
  Settings,
  UserCircle,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/shared/components/ui";

import { useUIStore } from "@/store/ui.store";

const AdminNavbar = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-lg p-2 hover:bg-background lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted text-xs">
              Manage platform operations
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="hidden w-full max-w-md lg:block">
          <div className="relative">
            <Search
              size={18}
              className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
            />

            <input
              type="text"
              placeholder="Search users, venues, bookings..."
              className="
                w-full
                rounded-xl
                border
                border-border
                bg-background
                py-2
                pr-4
                pl-10
                text-sm
                outline-none
                transition
                focus:border-primary
              "
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            className="
              relative
              rounded-xl
              p-2
              text-muted
              transition
              hover:bg-background
              hover:text-foreground
            "
          >
            <Bell size={20} />
            <span
              className="
                absolute
                top-1
                right-1
                h-2
                w-2
                rounded-full
                bg-error
              "
            />
          </button>

          <ThemeToggle />

          <button
            className="
              rounded-xl
              p-2
              text-muted
              transition
              hover:bg-background
              hover:text-foreground
            "
          >
            <Settings size={20} />
          </button>

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-border
              bg-background
              px-3
              py-2
            "
          >
            <UserCircle
              size={28}
              className="text-primary"
            />

            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-foreground">
                Admin
              </p>
              <p className="text-muted text-xs">
                Super Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;