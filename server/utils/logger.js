const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const colors = {
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[36m',
    http: '\x1b[35m',
    debug: '\x1b[32m',
    reset: '\x1b[0m'
};

const currentLevel = process.env.LOG_LEVEL || 'debug';

const shouldLog = (level) => {
    return levels[level] <= levels[currentLevel];
};

const formatMessage = (level, message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaString}`;
};

const writeToFile = (level, formattedMessage) => {
    const logFile = path.join(logDir, `${level}.log`);
    fs.appendFileSync(logFile, formattedMessage + '\n');
    
    const combinedFile = path.join(logDir, 'combined.log');
    fs.appendFileSync(combinedFile, formattedMessage + '\n');
};

const logger = {
    error: (message, meta) => {
        if (shouldLog('error')) {
            const formatted = formatMessage('error', message, meta);
            console.error(colors.error + formatted + colors.reset);
            writeToFile('error', formatted);
        }
    },
    
    warn: (message, meta) => {
        if (shouldLog('warn')) {
            const formatted = formatMessage('warn', message, meta);
            console.warn(colors.warn + formatted + colors.reset);
            writeToFile('warn', formatted);
        }
    },
    
    info: (message, meta) => {
        if (shouldLog('info')) {
            const formatted = formatMessage('info', message, meta);
            console.info(colors.info + formatted + colors.reset);
            writeToFile('info', formatted);
        }
    },
    
    http: (message, meta) => {
        if (shouldLog('http')) {
            const formatted = formatMessage('http', message, meta);
            console.log(colors.http + formatted + colors.reset);
            writeToFile('http', formatted);
        }
    },
    
    debug: (message, meta) => {
        if (shouldLog('debug')) {
            const formatted = formatMessage('debug', message, meta);
            console.debug(colors.debug + formatted + colors.reset);
            writeToFile('debug', formatted);
        }
    }
};

module.exports = logger;