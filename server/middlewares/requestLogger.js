const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')?.substring(0, 100)
        };

        if (req.user) {
            logData.userId = req.user._id;
            logData.userRole = req.user.role;
        }

        if (res.statusCode >= 400) {
            logger.warn('Request completed with error', logData);
        } else if (duration > 1000) {
            logger.warn('Slow request detected', logData);
        } else {
            logger.http('Request completed', logData);
        }
    });

    next();
};

module.exports = requestLogger;