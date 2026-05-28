import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../config/api';
import toast from 'react-hot-toast';
import { HiOutlineLink, HiOutlineTag, HiOutlineCalendar } from 'react-icons/hi';

const UrlForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    longUrl: '',
    customAlias: '',
    title: '',
    tags: '',
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        longUrl: formData.longUrl,
        customAlias: formData.customAlias || undefined,
        title: formData.title || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
        expiresAt: formData.expiresAt || undefined,
      };
      
      await api.post('/api/urls', data);
      toast.success('URL shortened successfully!');
      navigate('/urls');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create Short URL</h1>
          <p className="text-gray-400 mt-1">Shorten a long URL into a compact link</p>
        </div>

        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Long URL *</label>
              <div className="relative">
                <HiOutlineLink className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  name="longUrl"
                  value={formData.longUrl}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="https://example.com/very-long-url"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Custom Alias (optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-sm">urlshort.com/</span>
                <input
                  type="text"
                  name="customAlias"
                  value={formData.customAlias}
                  onChange={handleChange}
                  className="input-field pl-28"
                  placeholder="my-link"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title (optional)</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="My awesome link"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <HiOutlineTag className="inline w-4 h-4 mr-1" />
                Tags (optional, comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="docs, reference, tutorial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <HiOutlineCalendar className="inline w-4 h-4 mr-1" />
                Expiration Date (optional)
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Creating...' : 'Create Short URL'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/urls')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UrlForm;