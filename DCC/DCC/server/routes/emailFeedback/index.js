var router = require('express').Router();

// split up route handling
router.use('/emailFeedback', require('./emailFeedback'));

// etc.

module.exports = router;
