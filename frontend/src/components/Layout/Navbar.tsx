import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          🔥 Habit Tracker
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user.email} ({user.timezone})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
