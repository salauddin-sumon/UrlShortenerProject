const helmet = require('helmet');

const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
});

const sanitizeInput = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    next();
};

const sanitizeXSS = (value) => {
    if (typeof value === 'string') {
        return value
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }
    return value;
};

const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        const cleanKey = key.replace(/[$.]/g, '');
        
        if (typeof value === 'string') {
            sanitized[cleanKey] = sanitizeXSS(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[cleanKey] = sanitizeObject(value);
        } else {
            sanitized[cleanKey] = value;
        }
    }
    
    return sanitized;
};

module.exports = {
    securityHeaders,
    sanitizeInput
};