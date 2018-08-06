var log = require('../config/config')["log"];
var _userModel = require('./DataObjects/user');
var md5 = require('md5');
module.exports = function (sequelize) {
    var User = sequelize.define('User', _userModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getUserByUserID: function (userId, cb) {
                var query = {
                    where: {
                        id: userId
                    }
                }                
                User.findOne(query).then(cb);

            },

            // get User ID who doesn't learn that course
            getAllUserByCourseID: function (courseID, cb) {            
                var qu = 'SELECT * FROM user WHERE ID NOT IN (SELECT traineeId FROM class,course,class_record WHERE class.courseId=course.id AND course.id='+courseID+' AND class.ID=class_record.classId);';
                sequelize.query(qu, {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
               
            },

            getAllAdmin: function (cb) {
                var query = {
                    where: {
                        isAdmin: true
                    }
                }
                User.findAll(query).then(cb);
            },

            getAllTrainer: function (cb) {
                var query = {
                    where: {
                        isTrainer: true
                    }
                }
                User.findAll(query).then(cb);
            },

            getUserByEmail: function (userEmail, cb) {
                var query = {
                    where: {
                        email: userEmail
                    }
                };
                User.findOne(query).then(cb);
            },

            getUserByEmailAndPassword: function (userEmail, userPassword, cb) {
                var query = {
                    where: {
                        email: userEmail,
                        password: userPassword
                    }
                };
                User.findOne(query).then(cb);
            },

            getAllUsers: function (cb) {
                User.findAll().then(cb);
            },

            getEmailUsers: function (cb) {
                sequelize.query('SELECT * FROM user us where us.isNotificationEmail = 1 order by us.email', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // -------------------------------------------------------- TL Team - Ngoc Thanh ------------------------------------------------------------- //

            // get users don't feedback in all class
            getUserDontFeedback: function(cb) {
                sequelize.query('select user.* from class_record, user where class_record.traineeId not in (select user.id from user, class_record where class_record.traineeId = user.id and class_record.trainer_rating >= 0)', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // get user max rating for trainer in all class
            getUserMaxRatingTrainer: function(cb) {
                sequelize.query('select user.* from user, class_record where class_record.traineeId = user.id and class_record.trainer_rating = 5', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // get user max rating for contents in all class
            getUserMaxRatingContents: function(cb) {
                sequelize.query('select user.* from user, class_record where class_record.traineeId = user.id and class_record.content_rating = 5', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // get user max rating for happy in all class
            getUserMaxRatingHappy: function(cb) {
                sequelize.query('select user.* from user, class_record where class_record.traineeId = user.id and class_record.happy_rating = 5', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // filter users have improve comment in all class 
            getUserHaveImproveComment: function(cb) {
                sequelize.query('SELECT DISTINCT class_record.traineeId FROM class_record, user WHERE class_record.traineeId = user.id and LENGTH(class_record.improve_comments) >= 0', {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },

            // get user of 1 course XXX, they don't feedback
            getUserDontFeedbackByCourseID: function(courseID, cb) {
                sequelize.query('select user.* '
                                + ' from user, class_record, class '
                                + ' where user.id = class_record.traineeId and class.id = class_record.classId '
                                + ' and class_record.status = "Learned" and class.courseId = ' + courseID
                                + ' and user.id not in (SELECT class_record.traineeId '
                                                    + ' FROM class_record '
                                                    + ' WHERE LENGTH(class_record.improve_comments) >= 0) ',{ 
                                type: sequelize.QueryTypes.SELECT
                        }).then(cb);
            },

            // Get all users dont learn specific course by team id
            getAllUserDontLearnByGroupID: function(groupID, cb) {
                sequelize.query('select DISTINCT user.* '
                             + ' from user, user_group '
                             + ' where user.id = user_group.userID and user_group.groupID in ' + groupID, {
                            type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },
        },
        tableName: 'user',
        timestamps: false
    });
    return User;
};