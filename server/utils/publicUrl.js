const config = require('../config');

const getPublicBaseUrl = (req) => {
    if (config.publicUrl) {
        return config.publicUrl;
    }

    const protocol = (req.get('x-forwarded-proto') || req.protocol || 'https')
        .split(',')[0]
        .trim();
    const host = req.get('x-forwarded-host') || req.get('host');

    return `${protocol}://${host}`;
};

const buildShortUrl = (req, url) => {
    const code = url.customAlias || url.shortCode;
    return `${getPublicBaseUrl(req)}/${code}`;
};

module.exports = { getPublicBaseUrl, buildShortUrl };
