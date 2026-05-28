const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 5000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener',
    },
    jwt: {
        accessSecret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100,
    }
};

module.exports = config;