var express = require('express');
var router = express.Router();
var log = require('../../config/config')["log"];
var Sequelize = require('sequelize');
var ldap = require('ldapjs');
var models = require('../../models');
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;
// admin's credentials for connecting to openLDAP server
var BASE_OPTS = require("../../config/config");
var md5 = require('md5');
var notification = require('../../notification/email');
var jwt = require('jsonwebtoken');
var fs=require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
// get homepage
router.get('/', function (req, res) {
    res.render('./index');
});


// passport Strategy
passport.use(new LdapStrategy(BASE_OPTS, function (user, callback) {
    // if authenticate success, user is returned here
    return callback(null, user);
}));

var userDefault = function (email) {
    var userName = email;
    var userDef = {
        username: userName.split('@')[0],
        status: 'activated',
        dob: '01/01/1994',
        phone: 'xxxx-xxx-xxx',
        location: 'DEK Technologies Vietnam',
        email: email,
        avatar: '/img/profiles/defaultProfile.jpg',
        isAdmin: false,
        isTrainer: false,
        isTrainee: true,
        belong2Team: 'Team ',
        isExperienced: 0,
        userType: 'Intern'
    }
    return userDef;

};

router.post('/login', function (req, res, next) {
    log.info('Post /login');
    passport.authenticate('ldapauth', {
        // using session to save user's credentials
        session: true
    }, function (err, user) {
        // if user does not exist, login fail
        if (!user) {
            models.User.getUserByEmailAndPassword(req.body.username, md5(req.body.password), function (_user) {
                if (_user && _user.status !== 'deactivated') {
                    passport.serializeUser(function (_user, done) {
                        done(null, _user.email);
                    });
                    // get user's credentials from session
                    passport.deserializeUser(function (email, callback) {
                        callback(null, {
                            email: email
                        });
                    });
                    return req.login(_user, function () {
                        log.info('User login: ' + _user.email);
                        var currentRole = _user.isAdmin ? 1 :
                                            _user.isTrainer ? 2 :
                                                 _user.isTrainee ? 3 : 0;    
                                
                        var token = jwt.sign( {email: _user.email} , settings.secret_key, {
                            expiresIn: "1d"
                        });
                        res.send({
                            role: currentRole,
                            data: _user,
                            token: token,
                            success: true,
                            msg: 'You are authenticated!'

                        });
                    });
                } else {
                    log.info('User login failed.');
                    res.send({
                        userid: null,
                        success: false,
                        msg: 'Wrong email or password',
                        error: err
                    });
                }
            })

        } else {
            // save user's credentials to session
            passport.serializeUser(function (user, done) {
                done(null, user.mail);
            });
            // get user's credentials from session
            passport.deserializeUser(function (email, callback) {
                callback(null, {
                    email: email
                });
            });

            // else login success
            return req.login(user, function () {
                log.info('User login: ' + user.mail);
                models.User.findOrCreate({
                    where: { email: user.mail },
                    defaults: userDefault(user.mail),
                })
                    .then(function (user) {
                        var currentRole = user[0].dataValues.isAdmin ? 1 :
                            user[0].dataValues.isTrainer ? 2 :
                                user[0].dataValues.isTrainee ? 3 : 0;
                        var token = jwt.sign( {email: user[0].dataValues.email} , settings.secret_key, {
                            expiresIn: "1d"
                        });
                        res.send({
                            role: currentRole,
                            data: user[0].dataValues,
                            token: token,
                            success: true,
                            msg: 'You are authenticated!'

                        });
                    });
            });
        }
    })(req, res, next);
});

router.get('/isLogin', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            success: true,
            msg: "You are logged in"
        });
    } else {
        res.send({
            success: false,
            msg: "You are NOT logged in"
        });
    }
})

router.get('/logout', function (req, res) {
    // destroy session and redirect to homepage when logout
    log.info('GET /logout');
    req.logout();
    req.session.destroy();
    res.send({
        success: true,
        msg: "Logout successfully"
    });

});




module.exports = router;
