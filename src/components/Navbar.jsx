import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, LogOut, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">LivePoll</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Welcome, <span className="font-semibold">{user.name}</span>
                  <span className="ml-2 text-sm text-gray-500 capitalize">({user.role})</span>
                </span>
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  // Scroll to the login form section
                  const loginSection = document.getElementById('login-section');
                  if (loginSection) {
                    loginSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                }}
                className="btn-primary"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;