const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
});

const urlCreateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: 'URL creation limit reached. Please try again in 1 hour.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'API rate limit exceeded. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const createCustomLimiter = (windowMinutes, maxRequests, message) => {
    return rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max: maxRequests,
        message: {
            success: false,
            message: message || 'Too many requests. Please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
            next(new AppError(message || 'Too many requests. Please try again later.', 429));
        }
    });
};

module.exports = {
    authLimiter,
    urlCreateLimiter,
    apiLimiter,
    createCustomLimiter
};