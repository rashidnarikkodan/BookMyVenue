import { useState } from 'react';
import { Menu, X, Search, Bell, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ui';

// Helper for navigation links
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Browse Venues', href: '/venues' },
  { name: 'Categories', href: '/categories' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 9v8l10 5 10-5V9l-10 6z" />
            </svg>
            <span className="font-semibold text-lg text-foreground">BookMyVenue</span>
          </Link>
        </div>

        {/* Center: Desktop navigation */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <button
            type="button"
            className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Search"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>
          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
          </button>
          {/* Favorites */}
          <button
            type="button"
            className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Favorites"
          >
            <Heart className="w-5 h-5" aria-hidden="true" />
          </button>
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <User className="w-5 h-5" aria-hidden="true" />
              <span className="hidden md:inline-block text-sm font-medium">John Doe</span>
            </button>
            {/* Dropdown – hidden for now, will be toggled via JS later */}
            {/* Placeholder for accessibility; actual implementation can use Headless UI or similar */}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={toggleMobile}
            className="p-2 rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Main menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 9v8l10 5 10-5V9l-10 6z" />
              </svg>
              <span className="font-semibold text-lg text-foreground">BookMyVenue</span>
            </Link>
            <button
              type="button"
              onClick={toggleMobile}
              className="p-2 rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Quick action icons */}
            <button
              type="button"
              className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Search"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
