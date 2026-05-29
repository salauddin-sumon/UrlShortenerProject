const Url = require('../models/Url');
const Click = require('../models/Click');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { generateShortCode, generateCustomCode } = require('../utils/shortCode');
const { buildShortUrl } = require('../utils/publicUrl');

const createShortUrl = asyncHandler(async (req, res) => {
    const { longUrl, customAlias, title, tags, expiresAt } = req.body;

    if (customAlias) {
        const existingAlias = await Url.findOne({ customAlias });
        if (existingAlias) {
            throw new AppError('Custom alias already taken', 400);
        }
    }

    let shortCode;
    if (customAlias) {
        shortCode = generateCustomCode(customAlias);
    } else {
        shortCode = generateShortCode();
        let existingCode = await Url.findOne({ shortCode });
        while (existingCode) {
            shortCode = generateShortCode();
            existingCode = await Url.findOne({ shortCode });
        }
    }

    const url = await Url.create({
        userId: req.user._id,
        longUrl,
        shortCode,
        customAlias: customAlias || undefined,
        title: title || 'Untitled',
        tags: tags || [],
        expiresAt: expiresAt || null
    });

    res.status(201).json({
        success: true,
        message: 'URL shortened successfully',
        data: {
            url: {
                id: url._id,
                longUrl: url.longUrl,
                shortUrl: buildShortUrl(req, url),
                shortCode: url.shortCode,
                customAlias: url.customAlias,
                title: url.title,
                tags: url.tags,
                clicks: url.clicks,
                expiresAt: url.expiresAt,
                createdAt: url.createdAt
            }
        }
    });
});

const getUserUrls = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const filter = { userId: req.user._id };
    
    if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.tag) {
        filter.tags = req.query.tag.toLowerCase();
    }
    
    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { longUrl: { $regex: req.query.search, $options: 'i' } },
            { customAlias: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const [urls, total] = await Promise.all([
        Url.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-__v'),
        Url.countDocuments(filter)
    ]);

    const urlsWithShortUrl = urls.map(url => ({
        ...url.toObject(),
        shortUrl: buildShortUrl(req, url)
    }));

    res.status(200).json({
        success: true,
        results: urls.length,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: {
            urls: urlsWithShortUrl
        }
    });
});

const getUrlById = asyncHandler(async (req, res) => {
    const url = await Url.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!url) {
        throw new AppError('URL not found', 404);
    }

    const clickStats = await Click.getClickStats(url._id);
    const clicksByDate = await Click.getClicksByDate(url._id);

    res.status(200).json({
        success: true,
        data: {
            url: {
                ...url.toObject(),
                shortUrl: buildShortUrl(req, url),
                analytics: {
                    ...clickStats,
                    clicksByDate
                }
            }
        }
    });
});

const updateUrl = asyncHandler(async (req, res) => {
    const { longUrl, customAlias, title, tags, isActive, expiresAt } = req.body;

    if (customAlias) {
        const existingAlias = await Url.findOne({
            customAlias,
            _id: { $ne: req.params.id }
        });
        if (existingAlias) {
            throw new AppError('Custom alias already taken', 400);
        }
    }

    const updateData = {};
    if (longUrl) updateData.longUrl = longUrl;
    if (customAlias) updateData.customAlias = generateCustomCode(customAlias);
    if (title) updateData.title = title;
    if (tags) updateData.tags = tags;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (expiresAt) updateData.expiresAt = expiresAt;

    const url = await Url.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
    );

    if (!url) {
        throw new AppError('URL not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'URL updated successfully',
        data: {
            url: {
                ...url.toObject(),
                shortUrl: buildShortUrl(req, url)
            }
        }
    });
});

const deleteUrl = asyncHandler(async (req, res) => {
    const url = await Url.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
    });

    if (!url) {
        throw new AppError('URL not found', 404);
    }

    await Click.deleteMany({ urlId: url._id });

    res.status(200).json({
        success: true,
        message: 'URL deleted successfully'
    });
});

const redirectUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    const url = await Url.findByShortCode(shortCode);

    if (!url) {
        throw new AppError('URL not found or expired', 404);
    }

    if (url.isExpired()) {
        url.isActive = false;
        await url.save();
        throw new AppError('This link has expired', 410);
    }

    const clickData = {
        urlId: url._id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer') || 'Direct',
        browser: req.get('User-Agent') ? req.get('User-Agent').split(' ').pop() : 'Unknown',
        device: req.get('User-Agent') ? (req.get('User-Agent').includes('Mobile') ? 'Mobile' : 'Desktop') : 'Unknown'
    };

    await Promise.all([
        url.incrementClicks(),
        Click.create(clickData)
    ]);

    res.redirect(301, url.longUrl);
});

module.exports = {
    createShortUrl,
    getUserUrls,
    getUrlById,
    updateUrl,
    deleteUrl,
    redirectUrl
};