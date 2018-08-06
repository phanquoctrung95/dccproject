var router = require('express').Router();
var jwt = require('jsonwebtoken');
var fs=require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');

var middlewareAuth = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
      jwt.verify(token, settings.secret_key, (err, decoded) => {
          if (err) {
              return res.json({
                  success: false,
                  message: 'Failed to authenticate token.'
              });
          } else {
              req.decoded = decoded;
              next();
          }
      });
  } else {
      return res.status(403).send({
          success: false,
          message: 'No token provied.'
      });
  }
};

// split up route handling
router.use('/dashboard', middlewareAuth, require('./dashboard'));
router.use('/courseRegister', middlewareAuth, require('./courseRegister'));
router.use('/feedback', middlewareAuth, require('./feedback'));
router.use('/viewSchedule', require('./viewSchedule'));

// etc.

module.exports = router;
