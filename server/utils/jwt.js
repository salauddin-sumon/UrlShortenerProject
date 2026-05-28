const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.accessSecret,
        { expiresIn: config.jwt.accessExpiry }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiry }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwt.accessSecret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};