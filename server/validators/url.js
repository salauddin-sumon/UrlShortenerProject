const { body, param, query } = require('express-validator');

const createUrlValidator = [
    body('longUrl')
        .trim()
        .notEmpty().withMessage('URL is required')
        .isURL({ 
            protocols: ['http', 'https'],
            require_protocol: false 
        }).withMessage('Please provide a valid URL'),
    
    body('customAlias')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('Custom alias must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Custom alias can only contain letters, numbers, underscores, and hyphens'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    
    body('expiresAt')
        .optional()
        .isISO8601().withMessage('Please provide a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        })
];

const updateUrlValidator = [
    param('id')
        .isMongoId().withMessage('Invalid URL ID'),
    
    body('longUrl')
        .optional()
        .trim()
        .isURL({ 
            protocols: ['http', 'https'],
            require_protocol: false 
        }).withMessage('Please provide a valid URL'),
    
    body('customAlias')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('Custom alias must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Custom alias can only contain letters, numbers, underscores, and hyphens'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),
    
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    
    body('expiresAt')
        .optional()
        .isISO8601().withMessage('Please provide a valid date')
];

const redirectValidator = [
    param('shortCode')
        .trim()
        .notEmpty().withMessage('Short code is required')
        .isLength({ min: 1, max: 20 }).withMessage('Invalid short code length')
];

module.exports = {
    createUrlValidator,
    updateUrlValidator,
    redirectValidator
};