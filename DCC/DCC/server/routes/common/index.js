var router = require('express').Router();

// split up route handling
router.use('/course', require('./course'));
router.use('/class', require('./class'));
router.use('/classrecord', require('./classrecord'));
router.use('/setting',require('./setting'));
// etc.

module.exports = router;
