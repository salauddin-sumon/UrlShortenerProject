import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineKey, HiOutlinePencil, HiOutlineCheck, HiOutlineX, HiOutlineLockClosed } from 'react-icons/hi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEditClick = () => {
    setProfileData({ name: user?.name || '', email: user?.email || '' });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileData({ name: user?.name || '', email: user?.email || '' });
    setIsEditing(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.patch('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      admin: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
      user: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return roleStyles[role] || roleStyles.user;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

        <div className="glass-card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-2xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <HiOutlineMail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border capitalize ${getRoleBadge(user?.role)}`}>
                    <HiOutlineShieldCheck className="w-3 h-3 inline mr-1" />
                    {user?.role?.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="btn-secondary flex items-center space-x-2"
              >
                <HiOutlinePencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4 border-t border-gray-800 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <HiOutlineUser className="inline w-4 h-4 mr-1" />
                  Full name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <HiOutlineMail className="inline w-4 h-4 mr-1" />
                  Email address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button type="submit" disabled={profileLoading} className="btn-primary flex items-center space-x-2">
                  <HiOutlineCheck className="w-4 h-4" />
                  <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <HiOutlineX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t border-gray-800 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-dark/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-white font-medium">{user?.name}</p>
                </div>
                <div className="bg-surface-dark/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div className="bg-surface-dark/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Status</p>
                  <p className="text-emerald-400 font-medium flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                    Active
                  </p>
                </div>
                <div className="bg-surface-dark/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Login</p>
                  <p className="text-white font-medium">
                    {user?.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString('en-US', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <HiOutlineKey className="w-5 h-5 mr-2" />
              Password & Security
            </h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <HiOutlineLockClosed className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {!isChangingPassword ? (
            <div className="border-t border-gray-800 pt-6">
              <div className="bg-surface-dark/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Password</p>
                <p className="text-white font-medium">••••••••••••</p>
                <p className="text-xs text-gray-500 mt-1">Last changed: {user?.passwordChangedAt 
                  ? new Date(user.passwordChangedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Never'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-800 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Enter current password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Min. 8 characters, include uppercase & number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm new password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button type="submit" disabled={passwordLoading} className="btn-primary flex items-center space-x-2">
                  <HiOutlineCheck className="w-4 h-4" />
                  <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <HiOutlineX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;