var router = require('express').Router();

// split up route handling
router.use('/userProfile', require('./userProfile'));

// etc.

module.exports = router;
