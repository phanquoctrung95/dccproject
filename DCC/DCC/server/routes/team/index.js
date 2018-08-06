var router = require('express').Router();

// split up route handling
router.use('/team', require('./team'));

// etc.

module.exports = router;