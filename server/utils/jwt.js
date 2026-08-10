const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('./AppError');

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
    try {
        return jwt.verify(token, config.jwt.accessSecret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new AppError('Access token expired. Please log in again.', 401);
        }
        if (err.name === 'JsonWebTokenError') {
            throw new AppError('Invalid access token. Please log in again.', 401);
        }
        throw err;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new AppError('Refresh token expired. Please log in again.', 401);
        }
        if (err.name === 'JsonWebTokenError') {
            throw new AppError('Invalid refresh token. Please log in again.', 401);
        }
        throw err;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};