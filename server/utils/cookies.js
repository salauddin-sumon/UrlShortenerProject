const config = require('../config');

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

module.exports = { refreshTokenCookieOptions };
