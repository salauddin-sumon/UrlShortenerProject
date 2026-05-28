const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    urlId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Url',
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    ipAddress: String,
    userAgent: String,
    referrer: String,
    country: String,
    city: String,
    device: String,
    browser: String,
    os: String
}, {
    timestamps: false
});

clickSchema.index({ urlId: 1, timestamp: -1 });

clickSchema.statics.getClickStats = async function(urlId, startDate, endDate) {
    const matchStage = { urlId: new mongoose.Types.ObjectId(urlId) };
    
    if (startDate || endDate) {
        matchStage.timestamp = {};
        if (startDate) matchStage.timestamp.$gte = new Date(startDate);
        if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }

    const stats = await this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueIPs: { $addToSet: '$ipAddress' },
                browsers: { $addToSet: '$browser' },
                devices: { $addToSet: '$device' },
                countries: { $addToSet: '$country' }
            }
        },
        {
            $project: {
                _id: 0,
                totalClicks: 1,
                uniqueVisitors: { $size: '$uniqueIPs' },
                browsers: { $size: '$browsers' },
                devices: { $size: '$devices' },
                countries: { $size: '$countries' }
            }
        }
    ]);

    return stats[0] || { totalClicks: 0, uniqueVisitors: 0, browsers: 0, devices: 0, countries: 0 };
};

clickSchema.statics.getClicksByDate = async function(urlId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.aggregate([
        {
            $match: {
                urlId: new mongoose.Types.ObjectId(urlId),
                timestamp: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                },
                clicks: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } },
        {
            $project: {
                _id: 0,
                date: '$_id',
                clicks: 1
            }
        }
    ]);
};

module.exports = mongoose.model('Click', clickSchema);