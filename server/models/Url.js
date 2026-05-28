const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    longUrl: {
        type: String,
        required: [true, 'Long URL is required'],
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true,
        minlength: [3, 'Custom alias must be at least 3 characters'],
        maxlength: [20, 'Custom alias cannot exceed 20 characters'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Custom alias can only contain letters, numbers, underscores, and hyphens']
    },
    title: {
        type: String,
        default: 'Untitled'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    clicks: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

urlSchema.index({ userId: 1, createdAt: -1 });

urlSchema.pre('save', function() {
    if (this.isModified('longUrl')) {
        if (!this.longUrl.startsWith('http://') && !this.longUrl.startsWith('https://')) {
            this.longUrl = 'https://' + this.longUrl;
        }
    }
});

urlSchema.methods.incrementClicks = async function() {
    this.clicks += 1;
    return this.save();
};

urlSchema.methods.isExpired = function() {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
};

urlSchema.statics.findByShortCode = function(shortCode) {
    return this.findOne({
        $or: [
            { shortCode: shortCode },
            { customAlias: shortCode }
        ],
        isActive: true
    });
};

module.exports = mongoose.model('Url', urlSchema);