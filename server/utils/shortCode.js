const crypto = require('crypto');

const generateShortCode = (length = 7) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
        result += characters[bytes[i] % characters.length];
    }
    
    return result;
};

const generateCustomCode = (customAlias) => {
    return customAlias
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 20);
};

module.exports = { generateShortCode, generateCustomCode };