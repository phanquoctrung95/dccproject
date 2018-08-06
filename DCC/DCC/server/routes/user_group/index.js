var router = require('express').Router();

// split up route handling
router.use('/user_group', require('./user_group'));

// etc.

module.exports = router;
