import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../config/api';
import toast from 'react-hot-toast';
import { HiOutlineUsers, HiOutlineLink, HiOutlineCursorClick, HiOutlineShieldCheck, HiOutlineSearch, HiOutlineX, HiOutlineCheck, HiOutlineTrash } from 'react-icons/hi';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [urlPage, setUrlPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [urlTotalPages, setUrlTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') fetchDashboard();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'urls') fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userPage, urlPage]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/dashboard');
      setDashboard(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: userPage, limit: 10 });
      if (search) params.append('search', search);
      const response = await api.get(`/api/admin/users?${params}`);
      setUsers(response.data.data.users);
      setUserTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: urlPage, limit: 10 });
      if (search) params.append('search', search);
      const response = await api.get(`/api/admin/urls?${params}`);
      setUrls(response.data.data.urls);
      setUrlTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.patch(`/api/admin/users/${userId}/toggle-status`);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role });
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their data?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'users') {
      setUserPage(1);
      fetchUsers();
    } else if (activeTab === 'urls') {
      setUrlPage(1);
      fetchUrls();
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: HiOutlineShieldCheck },
    { id: 'users', name: 'Users', icon: HiOutlineUsers },
    { id: 'urls', name: 'URLs', icon: HiOutlineLink },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-1">Manage users and monitor system</p>
        </div>

        <div className="flex space-x-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-surface-medium'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : dashboard && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="glass-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Users</p>
                        <p className="text-3xl font-bold text-white mt-1">{dashboard.stats.totalUsers}</p>
                      </div>
                      <HiOutlineUsers className="w-8 h-8 text-primary-400" />
                    </div>
                  </div>
                  <div className="glass-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total URLs</p>
                        <p className="text-3xl font-bold text-white mt-1">{dashboard.stats.totalUrls}</p>
                      </div>
                      <HiOutlineLink className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div className="glass-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Clicks</p>
                        <p className="text-3xl font-bold text-white mt-1">{dashboard.stats.totalClicks}</p>
                      </div>
                      <HiOutlineCursorClick className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>
                  <div className="glass-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Active URLs</p>
                        <p className="text-3xl font-bold text-white mt-1">{dashboard.stats.activeUrls}</p>
                      </div>
                      <HiOutlineShieldCheck className="w-8 h-8 text-rose-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
                    <div className="space-y-3">
                      {dashboard.recentUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <span className="px-2 py-0.5 text-xs bg-primary-600/20 text-primary-400 rounded-full capitalize">
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card">
                    <h3 className="text-lg font-semibold text-white mb-4">Top URLs</h3>
                    <div className="space-y-3">
                      {dashboard.topUrls.slice(0, 5).map((url) => (
                        <div key={url.urlId} className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-lg">
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-white truncate">{url.title}</p>
                            <p className="text-xs text-primary-400 truncate">/{url.shortCode}</p>
                          </div>
                          <span className="text-sm text-gray-400">{url.clickCount} clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="glass-card mb-6">
              <form onSubmit={handleSearch} className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="input-field pl-10"
                />
              </form>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user._id} className="glass-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                          user.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="bg-surface-dark border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`p-2 rounded-lg transition-all ${
                            user.isActive ? 'text-amber-400 hover:bg-surface-dark' : 'text-emerald-400 hover:bg-surface-dark'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-surface-dark rounded-lg transition-all"
                          title="Delete user"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {userTotalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    {Array.from({ length: userTotalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setUserPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          userPage === p ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-surface-medium'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'urls' && (
          <div>
            <div className="glass-card mb-6">
              <form onSubmit={handleSearch} className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search URLs..."
                  className="input-field pl-10"
                />
              </form>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {urls.map((url) => (
                  <div key={url._id} className="glass-card">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white font-medium truncate">{url.title}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            url.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {url.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-primary-400 truncate">/{url.shortCode}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>{url.clicks} clicks</span>
                          {url.userId && <span>By: {url.userId.name}</span>}
                          <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {url.tags?.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-surface-dark rounded-full text-xs text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {urlTotalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    {Array.from({ length: urlTotalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setUrlPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          urlPage === p ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-surface-medium'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;