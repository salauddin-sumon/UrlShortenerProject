import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import UrlAnalyticsPanel from '../components/UrlAnalyticsPanel';
import api from '../config/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const UrlAnalytics = () => {
  const { id } = useParams();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [url, setUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          const response = await api.get(`/api/admin/urls/${id}/analytics`);
          setUrl(response.data.data.url);
          setAnalytics(response.data.data.analytics);
        } else {
          const response = await api.get(`/api/urls/${id}`);
          const urlData = response.data.data.url;
          setUrl(urlData);
          setAnalytics(urlData.analytics);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, isAdmin]);

  const backLink = isAdmin ? '/admin' : '/urls';
  const backLabel = isAdmin ? 'Admin panel' : 'My URLs';

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Link
          to={backLink}
          className="inline-flex items-center text-sm text-gray-400 hover:text-primary-400 mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="w-4 h-4 mr-1" />
          Back to {backLabel}
        </Link>

        <h1 className="text-2xl font-bold text-white mb-8">URL Analytics</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : url && analytics ? (
          <UrlAnalyticsPanel url={url} analytics={analytics} showOwner={isAdmin} />
        ) : (
          <div className="glass-card text-center py-12 text-gray-400">URL not found</div>
        )}
      </div>
    </Layout>
  );
};

export default UrlAnalytics;
