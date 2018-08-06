var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post('/getCourseDetail', function (req, res) {
    models.Course.getByID(req.body.courseId, function (course) {
        res.send({
            success: true,
            data: course
        });
    });
});
router.post('/getAllCourse', function (req, res) {
    models.Course.findAll().then(function (rs) {
        res.send({
            success: true,
            msg: "send course detail list",
            data: rs
        });
    });
});
router.post('/getRequesterByCourseID', function (req, res) {
    models.RequestOpening.findAll({
        include: [{
            model: models.User
        }],
        where: {
            courseId: req.body.courseId
        }
    }).then(
        function (data) {
            var userList = [];
            for (let i = 0; i < data.length; i++) {
                userList.push(data[i].dataValues.User);
            }
            res.send({
                success: true,
                data: userList
            });
        }
    )
});
router.post('/getClassByCourseID', function (req, res) {
    var order = req.body.order
    var query = {
        include: [models.User,
        {
            model: models.ClassRecord,
            include: [models.User]
        }
        ],
        where: {
            courseId: req.body.courseId
        },
        order: [
            ['startTime', order]
        ],
    };
  models.Class.getClassByCourseIDByQuery(query, res);
});


// Get course by class id 
router.post('/getCourseByClassID', function (req, res) {
    models.Course.getCourseByClassID(req.body.classID, function (rs) {
        res.send({
            success: true,
            msg: "Get all infomation about course by class id  ",
            data: rs
        })
    })
});

//Create API for conjob send email
router.post('/getCourseNameByClassId', function (req, res) {
    models.Course.getCourseNameByClassId(req.body.classID, function (rs) {
        res.send({
            success: true,
            msg: "Get all infomation about course name by class id",
            data: rs
        })
    })
});

router.post('/getCourseOfUserDontFeedbackByUserID', function (req, res) {
    models.Course.getCourseOfUserDontFeedbackByUserID(req.body.userID, function (rs) {
        res.send({
            success: true,
            msg: "Get all infomation about user dont feedback by userID",
            data: rs
        })
    })
});


module.exports = router;