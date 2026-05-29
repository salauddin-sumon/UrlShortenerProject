import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../config/api';
import { getShortUrl } from '../utils/shortUrl';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineSearch, HiOutlineClipboardCopy, HiOutlineExternalLink, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10, sort: '-createdAt' });
      if (search) params.append('search', search);
      
      const response = await api.get(`/api/urls?${params}`);
      setUrls(response.data.data.urls);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to load URLs');
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
      fetchUrls();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUrls();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My URLs</h1>
            <p className="text-gray-400 mt-1">{total} total URLs</p>
          </div>
          <Link to="/urls/create" className="btn-primary flex items-center space-x-2">
            <HiOutlinePlus className="w-5 h-5" />
            <span>New URL</span>
          </Link>
        </div>

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
        ) : urls.length === 0 ? (
          <div className="glass-card text-center py-12">
            <HiOutlineSearch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No URLs found</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {urls.map((url) => (
                <div key={url._id} className="glass-card hover:border-gray-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-medium truncate">{url.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${url.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {url.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <a
                        href={getShortUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                      >
                        <span className="truncate">/{url.customAlias || url.shortCode}</span>
                        <HiOutlineExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{url.clicks} clicks</span>
                        <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                        {url.tags?.length > 0 && (
                          <div className="flex space-x-1">
                            {url.tags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 bg-surface-dark rounded-full text-gray-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => copyToClipboard(getShortUrl(url))}
                        className="p-2 text-gray-500 hover:text-primary-400 hover:bg-surface-dark rounded-lg transition-all"
                        title="Copy link"
                      >
                        <HiOutlineClipboardCopy className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/urls/${url._id}/edit`}
                        className="p-2 text-gray-500 hover:text-amber-400 hover:bg-surface-dark rounded-lg transition-all"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteUrl(url._id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-surface-dark rounded-lg transition-all"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      page === p
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-surface-medium'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UrlList;