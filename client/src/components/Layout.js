import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLink, HiOutlineChartBar, HiOutlineUser, HiOutlineCog, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HiOutlineChartBar },
    { name: 'My URLs', href: '/urls', icon: HiOutlineLink },
    { name: 'Profile', href: '/profile', icon: HiOutlineUser },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: HiOutlineCog }] : []),
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-dark border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <HiOutlineLink className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">ShortURL</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-surface-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-surface-medium transition-all duration-200"
            >
              <HiOutlineLogout className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 bg-surface-dark/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <HiOutlineMenu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 text-xs font-medium bg-primary-600/20 text-primary-400 rounded-full border border-primary-500/20">
                {user?.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;