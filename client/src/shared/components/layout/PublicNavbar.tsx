import { useState, useEffect, useRef } from 'react';
import { Menu, X, Building2, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/shared/components/ui';
import logoImg from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Browse venues', href: '/venues' },
  { name: 'How it works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
];

// Hook: lock body scroll when drawer open
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);
}

const PublicNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/venues?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/venues');
    }
    setSearchOpen(false);
  };

  useScrollLock(drawerOpen);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logoImg}
              alt="BookMyVenue Logo"
              className="h-9 w-9 object-contain group-hover:scale-105 transition-all duration-300"
            />
            <span className="text-[17px] font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              BookMyVenue
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={[
                    'relative px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted/30 hover:text-foreground',
                  ].join(' ')}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="p-2 rounded-xl text-foreground/85 hover:bg-muted/30 hover:text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <ThemeToggle />

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            <Link
              to="/signin"
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-foreground/80 hover:bg-muted/30 hover:text-foreground transition-all duration-300"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl text-[13px] font-medium border border-border text-foreground hover:bg-muted/30 hover:border-muted transition-all duration-300 shadow-sm"
            >
              Sign up
            </Link>

            <div className="w-px h-5 bg-border mx-1" aria-hidden="true" />

            {/* Primary CTA — styled visually distinct with primary theme colors */}
            <Link
              to="/signup"
              state={{ role: 'owner' }}
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-[13px] font-semibold bg-primary text-white hover:bg-accent transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              <Building2 size={14} />
              Register as Owner
            </Link>
          </div>

          {/* Mobile right — theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              type="button"
              className="grid place-items-center h-9 w-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <ThemeToggle />

            <button
              onClick={() => setDrawerOpen((prev) => !prev)}
              className="grid place-items-center h-9 w-9 rounded-xl border border-border bg-surface text-foreground hover:bg-muted/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Header Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-0 bg-background z-50 flex items-center px-4 sm:px-6 lg:px-8 border-b border-border animate-in fade-in duration-200">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto w-full max-w-3xl flex items-center gap-3"
            >
              <button
                type="submit"
                className="text-primary hover:text-primary/80 transition-colors p-1 cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5 shrink-0" />
              </button>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for venues, categories, or cities..."
                className="w-full text-[14px] bg-transparent border-none text-foreground placeholder-foreground/50 focus:outline-none py-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted/50 text-foreground/75 hover:text-foreground transition-all duration-200 cursor-pointer"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs transition-opacity duration-300',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          'fixed top-0 right-0 z-50 h-full w-[290px] border-l border-border bg-surface flex flex-col md:hidden shadow-2xl',
          'transition-transform duration-300 ease-out',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Drawer header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-5 shrink-0">
          <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
            <img src={logoImg} alt="BookMyVenue Logo" className="h-8 w-8 object-contain" />
            <span className="text-[15px] font-bold text-foreground tracking-tight">
              BookMyVenue
            </span>
          </Link>

          <button
            onClick={() => setDrawerOpen(false)}
            className="grid place-items-center h-9 w-9 rounded-xl text-foreground/70 hover:bg-muted/40 hover:text-foreground transition-all duration-300"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1.5 p-5 flex-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={[
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted/30 hover:text-foreground',
                ].join(' ')}
                onClick={() => setDrawerOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA section — pinned to bottom */}
        <div className="p-5 border-t border-border bg-surface/50 backdrop-blur-sm flex flex-col gap-2.5 shrink-0">
          <Link
            to="/signin"
            state={{ from: { pathname: '/venu-owner' } }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-semibold bg-primary text-white hover:bg-accent transition-all duration-300 shadow-md shadow-primary/15"
            onClick={() => setDrawerOpen(false)}
          >
            <Building2 size={16} />
            Register as Owner
          </Link>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link
              to="/signin"
              className="flex items-center justify-center py-2.5 rounded-xl text-[13px] font-medium border border-border text-foreground/90 hover:bg-muted/30 transition-all duration-300"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="flex items-center justify-center py-2.5 rounded-xl text-[13px] font-medium bg-secondary text-white hover:opacity-95 transition-all duration-300"
              onClick={() => setDrawerOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicNavbar;
