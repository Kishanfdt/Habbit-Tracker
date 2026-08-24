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
    <nav className="border-b border-[#e9e9e7] bg-[#fbfbfa]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-semibold text-[#37352f] hover:opacity-80 transition-opacity"
        >
          <span className="text-lg">🔥</span>
          <span>Habit Tracker</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#787774]">
              {user.email} <span className="text-[#9b9a97]">({user.timezone})</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-[#787774] hover:bg-[#efefe0]/70 hover:text-[#37352f] transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
