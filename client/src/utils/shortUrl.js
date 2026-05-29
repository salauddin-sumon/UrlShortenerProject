const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://urlshortenerproject-152r.onrender.com'
    : 'http://localhost:5000');

/** Public short link — always use API value when present */
export const getShortUrl = (url) => {
  if (url?.shortUrl) return url.shortUrl;
  const code = url?.customAlias || url?.shortCode;
  if (!code) return '';
  return `${API_BASE.replace(/\/$/, '')}/${code}`;
};
