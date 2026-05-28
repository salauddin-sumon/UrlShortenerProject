const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { urlCreateLimiter } = require('../middlewares/rateLimiter');
const {
    createUrlValidator,
    updateUrlValidator
} = require('../validators/url');

router.post('/', protect, urlCreateLimiter, createUrlValidator, validate, urlController.createShortUrl);
router.get('/', protect, urlController.getUserUrls);
router.get('/:id', protect, urlController.getUrlById);
router.patch('/:id', protect, updateUrlValidator, validate, urlController.updateUrl);
router.delete('/:id', protect, urlController.deleteUrl);

module.exports = router;