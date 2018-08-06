var router = require('express').Router();
var models = require('../../models');

router.post('/getNotifications', function (req, res) {
    models.Notifications.getAllNotificationByUserId(req.body.userId, req.body.index, notifications => {
        //
        models.Notifications.update({
            status: 2
        }, {
                where: {
                    userId: req.body.userId,
                    status: 1,
                }
            });
        models.Notifications.update({
            status: 4
        }, {
                where: {
                    userId: req.body.userId,
                    status: 3,
                }
            });
        //
        notifications.reverse();
        //
        res.send({
            data: notifications,
            msg: 'got ' + notifications.length + ' notifications'
        });
    });
});
router.post('/getNotificationsRequestCourse', function (req, res) {
    models.Notifications.getAllNewNotificationsRequestCourse(req.body.userId, req.body.index, notifications => {
        //
        models.Notifications.update({
            status: 4
        }, {
                where: {
                    userId: req.body.userId,
                    status: 3,
                }
            });
        //
        notifications.reverse();
        //
        res.send({
            data: notifications,
            msg: 'got ' + notifications.length + ' request course notifications'
        });
    });
});

router.post('/getNumberofNewNotification', function (req, res) {
    models.Notifications.getNumberofNewNotification(req.body.userId, notifications => {
        res.send({
            data: notifications.count,
            success: true,
            msg: 'got ' + notifications.count + ' new notifications'
        });
    });
});

router.post('/getNumberofNewNotificationRequestCourse', function (req, res) {
    models.Notifications.getNumberofNewNotificationRequestCourse(req.body.userId, notifications => {
        res.send({
            data: notifications.count,
            success: true,
            msg: 'got ' + notifications.count + ' new request Course notifications '
        });
    });
});

router.post('/updateNotificationStatus', function (req, res) {
    models.Notifications.update({
        status: 0
    }, {
            where: {
                userId: req.body.userId,
                status: {
                    $ne: 0
                },
                id: req.body.id
            }
        }).then(function () {
            res.send({
                success: true,
                msg: "Status updated",
            });
        });
});

router.post('/getAllNewNotificationsAndUpdateStatus', function (req, res) {
    models.Notifications.getAllNewNotifications(req.body.userId, notifications => {
        models.Notifications.update({
            status: 0
        }, {
                where: {
                    userId: req.body.userId,
                    status: {
                        $ne: 0
                    },
                }
            }).then(function () {
                res.send({
                    data: notifications,
                    msg: "All status updated"
                });
            });
    });
});
router.post('/addNotification', function (req, res) {
    let sendMsg = (check) => {
        if (check === 0) {
            res.send({
                result: 0,
                msg: "Dont delete and insert new notification"
            });
        }
        else {
            res.send({
                result: 1,
                msg: "Delete and insert new notification"
            });
        }
    }
    models.Notifications.addNotification(req.body.email, req.body.userId, req.body.title, req.body.content, req.body.time, req.body.reference, req.body.status, sendMsg);
})
module.exports = router;
