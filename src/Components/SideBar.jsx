import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearSession, notifyAuthChange } from './useAuth';

const LOGGED_IN_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
  { to: '/search', label: 'Search recipes', icon: 'search' },
  { to: '/a-z', label: 'Browse by letter', icon: 'abc' },
  { to: '/categories', label: 'Browse categories', icon: 'category' },
];

const PUBLIC_LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search recipes', icon: 'search' },
  { to: '/a-z', label: 'Browse by letter', icon: 'abc' },
  { to: '/categories', label: 'Browse categories', icon: 'category' },
];

export default function SideBar({ open, onClose, loggedIn }) {
  const navigate = useNavigate();

  const go = (to) => {
    onClose();
    navigate(to);
  };

  const handleLogout = () => {
    clearSession();
    notifyAuthChange();
    onClose();
    navigate('/');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-base-content/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 transform flex-col bg-base-100 shadow-card transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
              <span className="material-symbols-outlined text-xl">restaurant</span>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Kusina</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-base-content/70 hover:bg-base-200"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {(loggedIn ? LOGGED_IN_LINKS : PUBLIC_LINKS).map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-base-300 p-4">
          {loggedIn ? (
            <div className="space-y-1">
              <Link
                to="/favorites"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">favorite</span>
                Favorites
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-error hover:bg-error/5"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => go('/login')}
                className="btn btn-outline btn-primary btn-block btn-sm"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => go('/signup')}
                className="btn btn-primary btn-block btn-sm"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

SideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};