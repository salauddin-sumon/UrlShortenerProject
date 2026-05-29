import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../config/api';
import { getShortUrl } from '../utils/shortUrl';
import toast from 'react-hot-toast';
import { HiOutlineLink, HiOutlineCursorClick, HiOutlinePlus, HiOutlineExternalLink, HiOutlineClipboardCopy, HiOutlineTrash, HiOutlineChartBar } from 'react-icons/hi';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0, activeUrls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/urls?limit=5&sort=-createdAt');
      setUrls(response.data.data.urls);
      
      setStats({
        totalUrls: response.data.total,
        totalClicks: response.data.data.urls.reduce((sum, url) => sum + url.clicks, 0),
        activeUrls: response.data.data.urls.filter(url => url.isActive).length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied!');
  };

  const deleteUrl = async (id) => {
    if (!window.confirm('Delete this URL?')) return;
    try {
      await api.delete(`/api/urls/${id}`);
      toast.success('URL deleted');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const statCards = [
    { name: 'Total URLs', value: stats.totalUrls, icon: HiOutlineLink, color: 'from-primary-500 to-primary-700' },
    { name: 'Total Clicks', value: stats.totalClicks, icon: HiOutlineCursorClick, color: 'from-emerald-500 to-emerald-700' },
    { name: 'Active URLs', value: stats.activeUrls, icon: HiOutlineChartBar, color: 'from-amber-500 to-amber-700' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Overview of your shortened URLs</p>
          </div>
          <Link to="/urls/create" className="btn-primary flex items-center space-x-2">
            <HiOutlinePlus className="w-5 h-5" />
            <span>New URL</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="glass-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.name}</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {loading ? '-' : stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent URLs</h2>
            <Link to="/urls" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineLink className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No URLs yet</p>
              <Link to="/urls/create" className="text-primary-400 hover:text-primary-300 text-sm mt-2 inline-block">
                Create your first short URL
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {urls.map((url) => (
                <div key={url._id} className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-white truncate">{url.title}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <a
                        href={getShortUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-400 hover:text-primary-300 truncate flex items-center space-x-1"
                      >
                        <span>/{url.customAlias || url.shortCode}</span>
                        <HiOutlineExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-xs text-gray-600">{url.clicks} clicks</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(getShortUrl(url))}
                      className="p-2 text-gray-500 hover:text-primary-400 hover:bg-surface-medium rounded-lg transition-all"
                      title="Copy link"
                    >
                      <HiOutlineClipboardCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUrl(url._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-surface-medium rounded-lg transition-all"
                      title="Delete"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;