import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-brand-600 transition-opacity hover:opacity-90"
        >
          <span className="text-2xl">🔥</span>
          <span className="bg-gradient-to-r from-brand-600 to-indigo-800 bg-clip-text text-transparent">
            Habit Tracker
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-slate-800">
                {user.email}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {user.timezone}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 transition-all active:scale-95"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
