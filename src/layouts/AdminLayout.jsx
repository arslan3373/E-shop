import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPackage, FiUsers, FiShoppingBag, FiTag, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome size={18} /> },
  { to: '/admin/products', label: 'Products', icon: <FiPackage size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={18} /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers size={18} /> },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white flex items-center justify-center font-bold">A</div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Admin</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden md:block">
              <input placeholder="Search admin..." className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className={`${open ? 'block' : 'hidden'} lg:block bg-white border border-gray-100 rounded-xl h-max sticky top-24`}>
            <nav className="py-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-all ${
                    isActive(item.to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive(item.to) ? 'text-primary-600' : 'text-gray-500'}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <section>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
