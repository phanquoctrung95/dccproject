var router = require('express').Router();

// split up route handling
router.use('/courses', require('./courses'));
router.use('/dashboard', require('./dashboard'));
// etc.

module.exports = router;
