var router = require('express').Router();

// split up route handling
router.use('/notification', require('./notification'));

// etc.

module.exports = router;
