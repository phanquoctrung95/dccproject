var _notificationsModel = require("./DataObjects/Notifications");
var Sequelize = require('sequelize');
var models = require("./index");

module.exports = function (sequelize) {
    var Notifications = sequelize.define('Notifications', _notificationsModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            addNotification: (email, userId, title, content, time, reference, status, callback) => {
                var index;
                Notifications.findAll({
                    attributes: ['content'],
                    where: {
                        email: email,
                        title: title
                    }
                }).then(result => {
                    if (result != 0) { // neu khác 0 -> có noti cũ
                        index = result[0].dataValues.content;
                        if (index == content) // noti cũ = noti mới --> ko cần add + ko cần xóa, hash là mới, index là cũ
                        {
                            callback(0);
                            return;
                        }
                        //xóa noti cũ
                        Notifications.destroy({
                            where: {
                                email: email,
                                title: title,
                                content: index
                            }
                        });
                    }
                    // add noti mới
                    var query = {
                        email: email,
                        userId: userId,
                        title: title,
                        content: content,
                        time: time,
                        reference: reference,
                        status: status,
                    }
                    Notifications.create(query);
                    callback(1);
                    return;
                });
            },
            // get ten newest notification from index
            // getAllNotificationByEmail: function (userEmail,index, cb) {
            //     var query = {
            //         where: {
            //             email: userEmail
            //         },
            //         order: 'time DESC',
            //         limit: 10,
            //         offset: index
            //     };
            //     Notifications.findAll(query).then(cb);
            // },
            getAllNotificationByUserId: function (userId, index, cb) {
                var query = {
                    where: {
                        userId: userId
                    },
                    order: 'time DESC',
                    limit: 10,
                    offset: index
                };
                Notifications.findAll(query).then(cb);
            },
            //get number of new notification unseen & new for request and add class
            getNumberofNewNotification: function (userId, cb) {
                var query = {
                    where: {
                        $or: [{
                            userId: userId,
                            status: 1                 // new & unseen add class notifi
                        },
                        {
                            userId: userId,
                            status: 3                 // new & unseen request course notifi
                        }]
                    }
                };
                Notifications.findAndCountAll(query).then(cb);
            },
            getAllNewNotificationsRequestCourse: function (userId, index, cb) {
                var query = {
                    where: {
                        $or: [{
                            userId: userId,
                            status: 3                 // new & unseen add class notifi
                        },
                        {
                            userId: userId,
                            status: 4                 // new & unseen request course notifi
                        }]
                    },
                    order: 'time DESC',
                    limit: 10,
                    offset: index
                };
                Notifications.findAll(query).then(cb);
            },
            // getNumberofNewNotificationAddClass: function (userEmail, cb){
            //     var query = {
            //         where: {
            //             email: userEmail,
            //             status: 1
            //         }
            //     };
            //     Notifications.findAndCountAll(query).then(cb);
            // },
            getNumberofNewNotificationRequestCourse: function (userId, cb) {
                var query = {
                    where: {
                        userId: userId,
                        status: 3
                    }
                };
                Notifications.findAndCountAll(query).then(cb);
            },
            getAllNewNotifications: function (userId, cb) {
                var query = {
                    where: {
                        userId: userId,
                        status: {
                            $ne: 0
                        }
                    }
                };
                Notifications.findAll(query).then(cb);
            },
            getAllNewNotificationsByEmail: function (email, cb) {
                var query = {
                    where: {
                        email: email,
                        status: {
                            $ne: 0
                        }
                    }
                };
                Notifications.findAll(query).then(cb);
            },

            getNotificationbyIdnUserId: function (notificatinIdnUserId, cb) {
                var query = {
                    where: {
                        id: notificatinIdnUserId.id,
                        userId: notificatinIdnUserId.userId
                    }
                };
                Notifications.findAll(query).then(cb);
            },
            setContentEmail: (course, req, settings, classID) => {
                var contentEmail = {
                    courseName: course.name,
                    description: course.description,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    location: req.body.location,
                    host: settings.host,
                    trainer: req.body.trainer.username,
                    courseID: course.id,
                    classID: classID
                };
                return contentEmail;
            }

        },
        tableName: 'notification',
        timestamps: false
    });
    return Notifications;
};
