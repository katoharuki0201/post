import { Link, useLocation } from 'react-router-dom';
import { Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen sticky top-0 px-4 py-4">
      {/* Logo */}
      <Link to="/" className="mb-6 p-3 rounded-full hover:bg-surface-hover transition-colors w-fit">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="text-text">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        <Link
          to="/"
          className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-medium transition-colors w-fit text-text hover:bg-surface-hover ${
            isActive('/') ? 'font-bold' : ''
          }`}
        >
          <Home size={26} />
          <span className="hidden xl:block">ホーム</span>
        </Link>
      </nav>

      {/* User section */}
      <div className="mt-auto">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 p-3 rounded-full hover:bg-surface-hover transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden xl:block min-w-0">
              <p className="font-bold text-text truncate">{user.name}</p>
              <p className="text-text-secondary text-sm truncate">@{user.email.split('@')[0]}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto p-2 rounded-full text-text-secondary hover:text-danger hover:bg-red-500/10 transition-colors"
              title="ログアウト"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`flex items-center gap-4 px-4 py-3 rounded-full text-xl font-medium transition-colors w-fit text-text hover:bg-surface-hover ${
              isActive('/login') ? 'font-bold' : ''
            }`}
          >
            <LogIn size={26} />
            <span className="hidden xl:block">ログイン</span>
          </Link>
        )}
      </div>
    </div>
  );
}
