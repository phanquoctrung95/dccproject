var router = require('express').Router();

// split up route handling
router.use('/group', require('./group'));

// etc.

module.exports = router;