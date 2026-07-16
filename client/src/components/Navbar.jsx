import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, User, LogOut, Dumbbell, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-gym-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white font-display font-extrabold text-2xl tracking-wider">
            <Dumbbell className="h-8 w-8 text-gym-neon animate-pulse" />
            <span>FIT<span className="text-gym-neon">ZONE</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gym-neon text-gray-200 transition-colors font-medium">Home</Link>
            <Link to="/store" className="hover:text-gym-neon text-gray-200 transition-colors font-medium">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="flex items-center space-x-1 text-gym-neon hover:text-white font-bold bg-gym-neon/10 px-3 py-1.5 rounded-lg border border-gym-neon/30 transition-all">
                <ShieldAlert className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Desktop Right Side Details */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-gym-neon transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gym-accent text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown / Login Button */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-200 hover:text-gym-neon transition-colors">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="h-9 w-9 rounded-full object-cover border-2 border-gym-neon" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gym-border flex items-center justify-center text-white border border-gym-neon font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gym-accent transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-gym-neon transition-colors font-medium">Log In</Link>
                <Link to="/register" className="bg-gym-neon hover:bg-gym-neonHover text-gym-dark font-bold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-gym-neon/20 transition-all duration-200">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Cart Trigger */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-gym-neon transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gym-accent text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-b border-gym-border animate-fade-in">
          <div className="px-2 pt-2 pb-6 space-y-2 sm:px-3 text-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:bg-gym-border hover:text-gym-neon">Home</Link>
            <Link to="/store" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:bg-gym-border hover:text-gym-neon">Shop</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-md text-base font-bold text-gym-neon hover:bg-gym-border">
                Admin Panel
              </Link>
            )}
            
            <div className="pt-4 border-t border-gym-border">
              {user ? (
                <div className="space-y-2">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-gray-200 hover:bg-gym-border">
                    <User className="h-5 w-5 text-gym-neon" />
                    <span>My Profile ({user.name})</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-md text-base font-medium text-gym-accent hover:bg-gym-border">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="py-2.5 border border-gym-border text-center rounded-md font-medium hover:bg-gym-border transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="py-2.5 bg-gym-neon text-gym-dark text-center rounded-md font-bold hover:bg-gym-neonHover transition-colors shadow-lg">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
