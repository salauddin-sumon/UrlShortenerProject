const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    changePasswordValidator
} = require('../validators/auth');

router.use(authLimiter);

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshAccessToken);

router.get('/me', protect, authController.getMe);
router.patch('/profile', protect, updateProfileValidator, validate, authController.updateProfile);
router.patch('/change-password', protect, changePasswordValidator, validate, authController.changePassword);

module.exports = router;