import React, { useState, useEffect } from 'react';
import api from '../config/api';
import toast from 'react-hot-toast';
import { HiOutlineX, HiOutlineLink, HiOutlineCursorClick } from 'react-icons/hi';

const UserStatsModal = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/admin/users/${userId}`);
        setData(response.data.data);
      } catch (error) {
        toast.error('Failed to load user stats');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId, onClose]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="glass-card w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <>
            <h3 className="text-lg font-semibold text-white mb-1">{data.user.name}</h3>
            <p className="text-sm text-gray-400 mb-6">{data.user.email}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <HiOutlineLink className="w-4 h-4" />
                  Total URLs
                </div>
                <p className="text-2xl font-bold text-white">{data.stats.totalUrls}</p>
              </div>
              <div className="bg-surface-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <HiOutlineCursorClick className="w-4 h-4" />
                  Total clicks
                </div>
                <p className="text-2xl font-bold text-white">{data.stats.totalClicks}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-gray-800 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="text-white capitalize">{data.user.role?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={data.user.isActive ? 'text-emerald-400' : 'text-red-400'}>
                  {data.user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="text-white">
                  {new Date(data.user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {data.user.lastLogin && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last login</span>
                  <span className="text-white">
                    {new Date(data.user.lastLogin).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default UserStatsModal;
