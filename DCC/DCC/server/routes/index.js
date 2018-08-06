var router = require('express').Router();
var authMiddleware = require('../middleware/authMiddleware.js');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../settings.js');
else
    settings = require('../../settingsDefault.js');

var middlewareAuth = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, settings.secret_key, (err, decoded) => {
            if (err) {
                return res.status(403).send({
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

router.use('/', require('./index/index.js'));

router.use('/common', middlewareAuth, require('./common'));
router.use('/trainee', require('./trainee'));
router.use('/trainer', middlewareAuth, require('./trainer'));
router.use('/admin', middlewareAuth, require('./admin'));
router.use('/user', middlewareAuth, require('./user'));
router.use('/notification', middlewareAuth, require('./notification'));
router.use('/emailFeedback', middlewareAuth, require('./emailFeedback'));
router.use('/team', middlewareAuth, require('./team'));
router.use('/user_team', middlewareAuth, require('./user_team'));
router.use('/group', middlewareAuth, require('./group'));
router.use('/user_group', middlewareAuth, require('./user_group'));
// router.get("/dowloandAPK", function (req, res) {

//     var file = __dirname + '/app-release.apk';

//     var filename = path.basename(file);
//     var mimetype = mime.lookup(file);

//     res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//     res.setHeader('Content-type', mimetype);

//     var filestream = fs.createReadStream(file);
//     filestream.pipe(res);
// })


module.exports = router;