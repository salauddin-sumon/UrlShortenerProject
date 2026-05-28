const User = require('../models/User');
const Url = require('../models/Url');
const Click = require('../models/Click');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalUrls,
        totalClicks,
        activeUrls,
        recentUsers,
        recentUrls
    ] = await Promise.all([
        User.countDocuments(),
        Url.countDocuments(),
        Click.countDocuments(),
        Url.countDocuments({ isActive: true }),
        User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
        Url.find().sort('-createdAt').limit(5).populate('userId', 'name email')
    ]);

    const topUrls = await Click.aggregate([
        {
            $group: {
                _id: '$urlId',
                clickCount: { $sum: 1 }
            }
        },
        { $sort: { clickCount: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'urls',
                localField: '_id',
                foreignField: '_id',
                as: 'url'
            }
        },
        { $unwind: '$url' },
        {
            $project: {
                _id: 0,
                urlId: '$_id',
                shortCode: '$url.shortCode',
                customAlias: '$url.customAlias',
                longUrl: '$url.longUrl',
                title: '$url.title',
                clickCount: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalUrls,
                totalClicks,
                activeUrls
            },
            recentUsers,
            recentUrls,
            topUrls
        }
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const filter = {};
    
    if (req.query.role) {
        filter.role = req.query.role;
    }
    
    if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-__v -passwordChangedAt -passwordResetToken -passwordResetExpires'),
        User.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        results: users.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: { users }
    });
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-__v -passwordChangedAt -passwordResetToken -passwordResetExpires');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const userUrls = await Url.find({ userId: user._id }).countDocuments();
    const userClicks = await Click.aggregate([
        {
            $lookup: {
                from: 'urls',
                localField: 'urlId',
                foreignField: '_id',
                as: 'url'
            }
        },
        { $unwind: '$url' },
        { $match: { 'url.userId': user._id } },
        { $count: 'totalClicks' }
    ]);

    res.status(200).json({
        success: true,
        data: {
            user,
            stats: {
                totalUrls: userUrls,
                totalClicks: userClicks.length > 0 ? userClicks[0].totalClicks : 0
            }
        }
    });
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
        throw new AppError('Invalid role', 400);
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
        throw new AppError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
    });
});

const toggleUserStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        }
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const userUrls = await Url.find({ userId: user._id });
    const urlIds = userUrls.map(url => url._id);

    await Promise.all([
        Url.deleteMany({ userId: user._id }),
        Click.deleteMany({ urlId: { $in: urlIds } }),
        User.findByIdAndDelete(user._id)
    ]);

    res.status(200).json({
        success: true,
        message: 'User and all associated data deleted successfully'
    });
});

const getAllUrls = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const filter = {};
    
    if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.userId) {
        filter.userId = req.query.userId;
    }
    
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { longUrl: { $regex: req.query.search, $options: 'i' } },
            { shortCode: { $regex: req.query.search, $options: 'i' } },
            { customAlias: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const [urls, total] = await Promise.all([
        Url.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email')
            .select('-__v'),
        Url.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        results: urls.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: { urls }
    });
});

const getUrlAnalytics = asyncHandler(async (req, res) => {
    const url = await Url.findById(req.params.id);

    if (!url) {
        throw new AppError('URL not found', 404);
    }

    const [
        clickStats,
        clicksByDate,
        recentClicks
    ] = await Promise.all([
        Click.getClickStats(url._id),
        Click.getClicksByDate(url._id, 30),
        Click.find({ urlId: url._id })
            .sort('-timestamp')
            .limit(20)
            .select('ipAddress userAgent referrer timestamp')
    ]);

    res.status(200).json({
        success: true,
        data: {
            url: {
                id: url._id,
                longUrl: url.longUrl,
                shortCode: url.shortCode,
                customAlias: url.customAlias,
                title: url.title,
                clicks: url.clicks,
                isActive: url.isActive,
                createdAt: url.createdAt
            },
            analytics: {
                ...clickStats,
                clicksByDate,
                recentClicks
            }
        }
    });
});

module.exports = {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    getAllUrls,
    getUrlAnalytics
};