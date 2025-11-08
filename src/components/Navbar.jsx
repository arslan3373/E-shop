import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiPhone, FiInfo, FiFileText, FiHelpCircle } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Close user menu when route changes
  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="flex justify-center items-center mr-2 w-10 h-10 text-white bg-gradient-to-r to-purple-600 rounded-lg transition-transform from-primary-600 group-hover:scale-110">
                <span className="text-xl font-bold">E</span>
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-primary-600">E-Shop</span>
            </Link>
            <div className="hidden ml-10 space-x-1 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center space-x-4 lg:flex">
            <Link to="/cart" className="relative p-2 text-gray-700 rounded-lg transition-all hover:text-primary-600 hover:bg-gray-50">
              <FiShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center px-4 py-2 space-x-2 text-gray-700 rounded-lg transition-all hover:text-primary-600 hover:bg-gray-50"
                >
                  <div className="flex justify-center items-center w-8 h-8 font-semibold text-white bg-gradient-to-r to-purple-500 rounded-full from-primary-500">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 py-2 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-2xl">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                      <FiUser className="mr-3" size={18} /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                      <FiPackage className="mr-3" size={18} /> My Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="my-2 border-t border-gray-100"></div>
                        <Link to="/admin/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                          <MdDashboard className="mr-3" size={18} /> Dashboard
                        </Link>
                        <Link to="/admin/categories" onClick={() => setShowUserMenu(false)} className="flex items-center px-4 py-2 text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-600">
                          <FiPackage className="mr-3" size={18} /> Categories
                        </Link>
                      </>
                    )}
                    <div className="my-2 border-t border-gray-100"></div>
                    <button onClick={() => { handleLogout(); setShowUserMenu(false); }} className="flex items-center px-4 py-2 w-full text-red-600 transition-colors hover:bg-red-50">
                      <FiLogOut className="mr-3" size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-6 py-2 font-medium text-gray-700 transition-colors hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 font-semibold text-white bg-gradient-to-r to-purple-600 rounded-full transition-all transform from-primary-600 hover:shadow-lg hover:scale-105">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 lg:hidden">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <FiShoppingCart size={24} />
              {getCartCount() > 0 && (
                <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 lg:hidden">
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-100"></div>
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FiUser className="inline mr-2" /> Profile
                </Link>
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50">
                  <FiPackage className="inline mr-2" /> My Orders
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <div className="my-2 border-t border-gray-100"></div>
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50">
                      <MdDashboard className="inline mr-2" /> Admin Dashboard
                    </Link>
                  </>
                )}
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block px-4 py-3 w-full text-left text-red-600 rounded-lg hover:bg-red-50">
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </>
            ) : (
              <div className="px-4 space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 w-full font-semibold text-center rounded-lg border border-primary-600 text-primary-600 hover:bg-primary-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 w-full font-semibold text-center text-white bg-gradient-to-r to-purple-600 rounded-lg from-primary-600">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;