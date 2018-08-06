var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var SequelizeDatatypes = require('sequelize');
router.post('/getAllClass', function (req, res) {
    models.Class.getAllClass(function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});
router.post('/getClassById', function (req, res) {
    models.Class.getClassByID(req.body.id, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getOpeningClassByCourseID', function (req, res) {
    models.Class.getOpeningClassByCourseID(req.body.courseId, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getAllOpenandIncomClass', function (req, res) {
    models.Class.getAllOpenandIncomClass(function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getUserInClass', function (req, res) {
    models.Class.getUserInClass(req.body.classId, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

router.post('/getOpeningClassByID', function (req, res) {
    models.Class.getOpeningClassByID(req.body.classId, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});


router.post('/getClassByCourseID', function (req, res) {
    models.Class.getClassByCourseID(req.body.courseID, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});



router.post('/getClassByCourseIDbyYear', function (req, res) {
    var year = new Date().getFullYear();
    var firstDay = new Date(year, 0, 1);
    var lastDay = new Date(year + 1, 0, 1);
    var query = {
        include: [models.User,
        {
            model: models.ClassRecord,
            include: [models.User]
        }
        ],

        where: {
            $and: [
                {
                    startTime: {
                        $between: [firstDay, lastDay]
                    }
                },
                { courseId: req.body.courseId }
            ]
        },
        order: [
            ['startTime', 'ASC']
        ],

    };
    models.Class.getClassByCourseIDByQuery(query, res);
});

router.post('/getClassByCourseIDbyMonth', function (req, res) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    var query = {
        include: [models.User,
        {
            model: models.ClassRecord,
            include: [models.User]
        }
        ],

        where: {
            $and: [
                {
                    startTime: {
                        $between: [firstDay, lastDay]
                    }
                },
                { courseId: req.body.courseId },
            ]
        },
        order: [
            ['startTime', 'ASC']
        ],

    };
    models.Class.getClassByCourseIDByQuery(query, res);
});


router.post('/getClassByCourseIDbyWeek', function (req, res) {
    var curr = new Date;
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    var query = {
        include: [models.User,
        {
            model: models.ClassRecord,
            include: [models.User]
        }
        ],

        where: {
            $and: [
                {
                    startTime: {
                        $between: [firstday, lastday]
                    }
                },
                { courseId: req.body.courseId }
            ]
        },
        order: [
            ['startTime', 'ASC']
        ],

    };
    models.Class.getClassByCourseIDByQuery(query, res);
});



// router.post('/deleteClassByID', function (req, res) {
//     models.Class.deleteClassByID(req.body.classId,function (rs) {
//         res.send({
//             success: true,
//             data: rs
//         });
//     });
// });

router.post('/getContentEmailFeedBackByClassID', function (req, res) {
    models.Class.getContentEmailFeedBackByClassID(req.body.classID, function (rs) {
        res.send({
            success: true,
            data: rs
        });
    });
});

module.exports = router;