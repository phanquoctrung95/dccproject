var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var sequelize = require("sequelize");
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');

// sessionClassTime
router.post('/getEnrolledCourseList', function (req, res) {
    var query = {
        include: [{
            model: models.Class,
            include: [{
                model: models.Course
            }]
        }],
        where: {
            traineeId: req.body.userId,
            status: {
                $or: ['Enrolled', 'Learned']
            }
        }
    };
    models.ClassRecord.getCourseListByQuery(query, res);
});

router.post('/getOtherEnrolledCourseList', function (req, res) {
    var query = {
        include: [{
            model: models.Class,
            include: [{
                model: models.Course
            }],
        }],
        where: {
            traineeId: {
                $ne: req.body.userId
            },
            status: {
                $or: ['Enrolled', 'Learned']
            }
        }
        //order: '`startTime` ASC'
    };
    models.ClassRecord.getCourseListByQuery(query, res);
});

router.get('/getAllEnrolledCourseList', function (req, res) {
    var query = {
        include: [{
            model: models.Class,
            include: [{
                model: models.Course
            }],
        }],
        where: {
            status: {
                $or: ['Enrolled', 'Learned']
            }
        }
        //order: '`startTime` ASC'
    };
    models.ClassRecord.getCourseListByQuery(query, res);
});
router.post('/getNumOfConfirmYesOfClass', function (req, res) {
    models.ClassRecord.getNumOfConfirmYesOfClass(req.body.classID, (rs) => {
        res.send({
            success: true,
            data: rs.length
        });
    })
});
router.post('/getNumOfConfirmNoOfClass', function (req, res) {
    models.ClassRecord.getNumOfConfirmNoOfClass(req.body.classID, (rs) => {
        res.send({
            success: true,
            data: rs.length
        });
    })
});
router.post('/getNumOfConfirmNullOfClass', function (req, res) {
    models.ClassRecord.getNumOfConfirmNullOfClass(req.body.classID, (rs) => {
        res.send({
            success: true,
            data: rs.length
        });
    })
});
router.get('/downloadCalendar', function (req, res) {
    res.download(path.join(__dirname, '../../../client/calendar', 'event.ics'));
});

module.exports = router;
