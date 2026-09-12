import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { useAuth, clearSession, notifyAuthChange } from './useAuth';

const LOGGED_IN_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
  { to: '/a-z', label: 'A to Z' },
  { to: '/categories', label: 'Categories' },
];

const PUBLIC_LINKS = [
  { to: '/search', label: 'Search' },
  { to: '/a-z', label: 'A to Z' },
  { to: '/categories', label: 'Categories' },
];

export default function TitleNav() {
  const navigate = useNavigate();
  const loggedIn = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    notifyAuthChange();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const links = loggedIn ? LOGGED_IN_LINKS : PUBLIC_LINKS;

  return (
    <nav className="sticky top-0 z-40 border-b border-base-300 bg-base-100">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex cursor-pointer items-center gap-2 rounded-lg"
            aria-label="Kusina home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
              <span className="material-symbols-outlined text-xl">restaurant</span>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Kusina</span>
          </button>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
                (isActive ? 'text-primary' : 'text-base-content/70 hover:text-primary hover:bg-base-200')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-base-300 bg-base-200 text-base-content transition-colors hover:border-primary/50"
                aria-label="Account menu"
              >
                <span className="material-symbols-outlined">person</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-card">
                  <Link
                    to="/favorites"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-base-content/80 hover:bg-base-200"
                  >
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    Favorites
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2 border-t border-base-300 px-4 py-3 text-left text-sm font-medium text-error hover:bg-error/5"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-base-content md:hidden"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>

      <SideBar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} loggedIn={loggedIn} />
    </nav>
  );
}