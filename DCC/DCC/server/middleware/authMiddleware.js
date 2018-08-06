var models = require('../models');
var log = require('../config/config')["log"];
var authMiddleware = {
    ensureAuthenticated: function(req, res, next) {
        log.info('Ensure authenticated middleware');
        if (req.isAuthenticated()) {
            return next();
        } else {
            log.info('Receive unauthenticated request');
            res.send({
                success: false,
                msg: "You need to login first"
            });
        }
    },
    ensureAdminPrivilege: function(req, res, next) {
        log.info('Ensure admin middleware');
        models.User.findOne({ where: { email: req.user.email } }).then(user => {
            if (req.isAuthenticated() && user.isAdmin) {
                return next();
            } else {
                log.info('Receive under-privilege request to admin route');
                res.send({
                    success: false,
                    msg: "You need Admin privilege to access this route"
                });
            }
        })
    },
    ensureTrainerPrivilege: function(req, res, next) {
        log.info('Ensure trainer middleware');
        models.User.findOne({ where: { email: req.user.email } }).then(user => {
            if (req.isAuthenticated() && user.isTrainer) {
                return next();
            } else {
                log.info('Receive under-privilege request to trainer route');
                res.send({
                    success: false,
                    msg: "You need Trainer privilege to access this route"
                });
            }
        })
    },
    ensureTraineePrivilege: function(req, res, next) {
        log.info('Ensure trainee middleware');
        models.User.findOne({ where: { email: req.user.email } }).then(user => {
            if (req.isAuthenticated() && user.isTrainee) {
                return next();
            } else {
                log.info('Receive under-privilege request to trainee route');
                res.send({
                    success: false,
                    msg: "You need Trainee privilege to access this route"
                });
            }
        });
    }
};

module.exports = authMiddleware;
