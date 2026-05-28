const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly, superAdminOnly } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    updateRoleValidator,
    userStatusValidator,
    deleteUserValidator,
    urlAnalyticsValidator
} = require('../validators/admin');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', adminController.getDashboardStats);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/role', updateRoleValidator, validate, superAdminOnly, adminController.updateUserRole);
router.patch('/users/:id/toggle-status', userStatusValidator, validate, adminController.toggleUserStatus);
router.delete('/users/:id', deleteUserValidator, validate, superAdminOnly, adminController.deleteUser);

router.get('/urls', adminController.getAllUrls);
router.get('/urls/:id/analytics', urlAnalyticsValidator, validate, adminController.getUrlAnalytics);

module.exports = router;