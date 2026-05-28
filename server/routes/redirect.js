const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const validate = require('../middlewares/validate');
const { redirectValidator } = require('../validators/url');

router.get('/:shortCode', redirectValidator, validate, urlController.redirectUrl);

module.exports = router;