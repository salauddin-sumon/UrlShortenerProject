const { body, param, query } = require('express-validator');

const updateRoleValidator = [
    param('id')
        .isMongoId().withMessage('Invalid user ID'),
    body('role')
        .trim()
        .notEmpty().withMessage('Role is required')
        .isIn(['user', 'admin', 'super_admin']).withMessage('Role must be user, admin, or super_admin')
];

const userStatusValidator = [
    param('id')
        .isMongoId().withMessage('Invalid user ID')
];

const deleteUserValidator = [
    param('id')
        .isMongoId().withMessage('Invalid user ID')
];

const urlAnalyticsValidator = [
    param('id')
        .isMongoId().withMessage('Invalid URL ID')
];

module.exports = {
    updateRoleValidator,
    userStatusValidator,
    deleteUserValidator,
    urlAnalyticsValidator
};