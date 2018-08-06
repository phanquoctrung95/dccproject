var router = require('express').Router();

// split up route handling
router.use('/user_team', require('./user_team'));

// etc.

module.exports = router;
