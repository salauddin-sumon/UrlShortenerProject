const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
require('dotenv').config();

const config = require('./config');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');
const requestLogger = require('./middlewares/requestLogger');
const { securityHeaders, sanitizeInput } = require('./middlewares/security');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();

app.set('trust proxy', 1);

app.use(securityHeaders);
logger.info('Security headers initialized');

const normalizeOrigin = (origin) =>
    origin?.trim().replace(/\/$/, '');

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    const normalized = normalizeOrigin(origin);
    return config.cors.origins.some(
        (allowed) => normalizeOrigin(allowed) === normalized
    );
};

app.use(cors({
    origin(origin, callback) {
        if (isOriginAllowed(origin)) {
            callback(null, true);
        } else {
            logger.warn('CORS blocked request', {
                origin,
                allowed: config.cors.origins
            });
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
}));
logger.info('CORS allowed origins', { origins: config.cors.origins });

app.use('/api', apiLimiter);
app.use(requestLogger);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(sanitizeInput);
app.use(hpp({
    whitelist: ['tags', 'role']
}));

if (config.env === 'development') {
    app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.json({
        message: 'URL Shortener API',
        version: '1.0.0',
        status: 'healthy'
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/url'));
app.use('/api/admin', require('./routes/admin'));
app.use('/', require('./routes/redirect'));

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.statusCode === 429) {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.originalUrl
        });
    } else if (err.statusCode >= 500) {
        logger.error('Server error', {
            message: err.message,
            stack: err.stack,
            path: req.originalUrl
        });
    }

    if (config.env === 'development') {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
        } else {
            logger.error('Unexpected error', err);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }
    }
});

process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});

mongoose.connect(config.mongodb.uri)
    .then(() => {
        logger.info('Connected to MongoDB successfully');
        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.env} mode`);
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    });