const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { refreshTokenCookieOptions } = require('../utils/cookies');

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email already registered', 400);
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user,
            accessToken
        }
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
        throw new AppError('Your account has been deactivated. Contact support.', 403);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
            user,
            accessToken
        }
    });
});

const logout = asyncHandler(async (req, res) => {
    req.user.refreshToken = null;
    await req.user.save({ validateBeforeSave: false });

    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new AppError('No refresh token provided', 401);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions);

    res.status(200).json({
        success: true,
        data: {
            accessToken: newAccessToken
        }
    });
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            user: req.user
        }
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (email) {
        const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: updatedUser
        }
    });
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
        throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    user.refreshToken = null;
    await user.save();

    res.clearCookie('refreshToken', refreshTokenCookieOptions);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: {
            accessToken
        }
    });
});

module.exports = {
    register,
    login,
    logout,
    refreshAccessToken,
    getMe,
    updateProfile,
    changePassword
};