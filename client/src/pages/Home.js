import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineLink, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineGlobe, HiOutlineArrowRight } from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: HiOutlineLightningBolt,
      title: 'Lightning Fast',
      description: 'Shorten URLs instantly with our optimized infrastructure. No waiting, just results.'
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Secure Links',
      description: 'Enterprise-grade security with JWT authentication and role-based access control.'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Advanced Analytics',
      description: 'Track clicks, geographic data, devices, and browsers for every short link.'
    },
    {
      icon: HiOutlineGlobe,
      title: 'Custom Aliases',
      description: 'Create branded, memorable links with custom aliases that reflect your brand.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-dark">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-surface-dark to-surface-dark" />

      <nav className="relative z-10 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <HiOutlineLink className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">ShortURL</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary flex items-center space-x-2">
                  <span>Dashboard</span>
                  <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8">
            <HiOutlineLightningBolt className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-300 font-medium">Simplify your links</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Short links,
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent"> big results</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Transform long, complex URLs into clean, trackable short links. 
            Built for developers with powerful analytics and enterprise security.
          </p>

          <div className="flex items-center justify-center space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 flex items-center space-x-2">
                <span>Go to Dashboard</span>
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Start for free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-gray-400">Powerful features to manage and track your links</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card group hover:border-primary-500/30 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-700/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card text-center p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">Join thousands of users who trust ShortURL for their link management.</p>
            <div className="flex items-center justify-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Create free account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded flex items-center justify-center">
              <HiOutlineLink className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-500">ShortURL &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Secure</span>
            <span>Fast</span>
            <span>Reliable</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;