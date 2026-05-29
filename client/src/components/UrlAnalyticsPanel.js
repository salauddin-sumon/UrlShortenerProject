import React from 'react';
import {
  HiOutlineCursorClick,
  HiOutlineUsers,
  HiOutlineDesktopComputer,
  HiOutlineGlobe,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import { getShortUrl } from '../utils/shortUrl';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="glass-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const UrlAnalyticsPanel = ({ url, analytics, showOwner }) => {
  const stats = analytics || {};
  const clicksByDate = stats.clicksByDate || [];
  const recentClicks = stats.recentClicks || [];
  const maxClicks = Math.max(...clicksByDate.map((d) => d.clicks), 1);

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-white">{url.title || 'Untitled'}</h2>
            <a
              href={getShortUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 mt-1"
            >
              {getShortUrl(url)}
              <HiOutlineExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
            <p className="text-sm text-gray-500 mt-2 truncate">{url.longUrl}</p>
            {showOwner && url.userId && (
              <p className="text-xs text-gray-500 mt-1">
                Owner: {typeof url.userId === 'object' ? url.userId.name : url.userId}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full ${
                url.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {url.isActive ? 'Active' : 'Inactive'}
            </span>
            {url.createdAt && (
              <span className="px-2.5 py-1 rounded-full bg-surface-dark text-gray-400">
                Created {new Date(url.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total clicks"
          value={stats.totalClicks ?? url.clicks ?? 0}
          icon={HiOutlineCursorClick}
          color="from-emerald-500 to-emerald-700"
        />
        <StatCard
          label="Unique visitors"
          value={stats.uniqueVisitors ?? 0}
          icon={HiOutlineUsers}
          color="from-primary-500 to-primary-700"
        />
        <StatCard
          label="Browser types"
          value={stats.browsers ?? 0}
          icon={HiOutlineDesktopComputer}
          color="from-amber-500 to-amber-700"
        />
        <StatCard
          label="Device types"
          value={stats.devices ?? 0}
          icon={HiOutlineDesktopComputer}
          color="from-cyan-500 to-cyan-700"
        />
        <StatCard
          label="Countries"
          value={stats.countries ?? 0}
          icon={HiOutlineGlobe}
          color="from-rose-500 to-rose-700"
        />
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Clicks — last 30 days</h3>
        {clicksByDate.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No clicks recorded in this period.</p>
        ) : (
          <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
            {clicksByDate.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center flex-1 min-w-[28px] max-w-[48px]"
                title={`${day.date}: ${day.clicks} clicks`}
              >
                <span className="text-[10px] text-gray-500 mb-1">{day.clicks}</span>
                <div
                  className="w-full bg-primary-600/80 rounded-t transition-all"
                  style={{ height: `${Math.max((day.clicks / maxClicks) * 100, 4)}%` }}
                />
                <span className="text-[9px] text-gray-600 mt-1 truncate w-full text-center">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent clicks</h3>
        {recentClicks.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No click events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-800">
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">IP</th>
                  <th className="pb-3 pr-4 font-medium">Device</th>
                  <th className="pb-3 pr-4 font-medium">Browser</th>
                  <th className="pb-3 pr-4 font-medium">Referrer</th>
                  <th className="pb-3 font-medium">User agent</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {recentClicks.map((click, index) => (
                  <tr key={index} className="border-b border-gray-800/50">
                    <td className="py-3 pr-4 whitespace-nowrap text-gray-400">
                      {new Date(click.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">{click.ipAddress || '—'}</td>
                    <td className="py-3 pr-4 text-xs">{click.device || '—'}</td>
                    <td className="py-3 pr-4 text-xs">{click.browser || '—'}</td>
                    <td className="py-3 pr-4 max-w-[120px] truncate">{click.referrer || 'Direct'}</td>
                    <td className="py-3 max-w-[200px] truncate text-xs text-gray-500">
                      {click.userAgent || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlAnalyticsPanel;
