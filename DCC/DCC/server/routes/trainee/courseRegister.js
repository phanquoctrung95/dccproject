var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var sequelize = require("sequelize");
var notification = require('../../notification');

router.get('/getTrainingProgram', function (req, res) {
    var query = {
        include: [models.Course]
    };
    models.TrainingProgram.getNestedTPBy(query, function (trainingProgram) {
        var datasend = {
            success: true,
            msg: 'send list success',
            data: trainingProgram
        };
        res.send(datasend);
    });
});

router.get('/getOpeningClass', function (req, res) {
    var query = {
        where: {
            startTime: {
                $gt: Date.now()
            }
        },
        include: [models.Course]
    }
    models.Class.findAll(query).then(function (openingClass) {
        var datasend = {
            success: true,
            msg: 'Get Opening Class Success',
            openingClass: openingClass
        };
        res.send(datasend);
    });
});
function getByUserId(userId){
    return new Promise(function(resolve, reject){
        models.RequestOpening.getByUserID(userId,cb);
        if(cb){
            return resolve(cb);
        }else{
            let errMsg="Can not request form server";
            return reject(errMsg);
        }

    })
}
// get By User 
router.post('/getByUserID', function (req, res) {
    var userId = req.body.userId;
    getByUserId(userId)
    .then(function(requestedOpeningCourse){
        let dataSend = {
            success: true,
            msg: 'get reqested Opening Courese Success',
            requestedOpeningCourse: requestedOpeningCourse
        }
        res.send(dataSend);
    })
    .catch(function(errMsg){
        let dataSend = {
            success: false,
            msg: errMsg,
            requestedOpeningCourse: null
        }
        res.send(dataSend);
    })
    // models.RequestOpening.getByUserID(userId, function (requestedOpeningCourse) {

    //     var datasend = {
    //         success: true,
    //         msg: 'Get Requested Opening Course Success',
    //         requestedOpeningCourse: requestedOpeningCourse
    //     };
    //     res.send(datasend);
    // });
});

router.post('/sendRegisterRequest', function (req, res) {
    var courseId = req.body.courseId;
    var userId = req.body.userId;
    var username = req.body.username;
    //If request is already existed, don't add request to request_course table
    //If not, add request to request_course table
    models.RequestOpening.findRequestOpenningCourse(userId, courseId, requestOpening => {
        if (requestOpening) {
            var datasend = {
                success: false,
                msg: 'You Have Already Requested'
            };
            res.send(datasend);
        } else {
            models.Class.getOpeningClassByCourseID(courseId, function (openingClass) {
                //If class is opening, add user request to request_course table with requestType = "enroll"
                //If not, add user request to request_course table with requestType = "register"
                if (openingClass) {
                    models.ClassRecord.findTraineeEnrolledClass(userId, openingClass.id, result => {
                        if (result) {
                            var datasend = {
                                success: false,
                                msg: 'You Have Already Enrolled'
                            };
                            res.send(datasend);
                        } else {
                            models.ClassRecord.enrollCourse(userId, openingClass.id, function () {
                                var datasend = {
                                    success: true,
                                    msg: 'Enroll Successfully'
                                };
                                res.send(datasend);
                            });
                        }
                    })
                } else { // if class is not open right now, send request to admin to open
                    models.RequestOpening.addRequestRegister(userId, courseId, function () {
                        models.Course.getByID(courseId, (courseResult) => { // get course's name from courseID
                            if (courseResult) {
                                models.User.getAllAdmin((adminArrayResult) => { //get all trainer info to send notification to each one
                                    if (adminArrayResult) {
                                        const title = courseResult.name;
                                        const content = `A new ${courseResult.name}'s class has been requested by ${username}.`;
                                        const reference = "admin_dashboard/" + courseResult.id + "@" + userId;
                                        for (let i = 0; i < adminArrayResult.length; ++i) {
                                            // add noti for each trainer
                                            notification([adminArrayResult[i].email], [adminArrayResult[i].id], title, content, content, reference, 3);
                                        }
                                    }
                                })
                            }
                        });
                        var datasend = {
                            success: true,
                            msg: 'Send request successfully'
                        };
                        res.send(datasend);
                    });
                }
            });
        }
    });
});

router.post('/deleteRequestOpening', function (req, res) {
    var courseId = req.body.courseId;
    var userId = req.body.userId;
    models.RequestOpening.deleteRequestOpening(userId, courseId, function () {
        var datasend = {
            success: true,
            msg: 'Delete Request Opening Success'
        }
        res.send(datasend);
    });
});

router.post('/unEnrollCourse', function (req, res) {
    var classId = req.body.classId;
    var traineeId = req.body.traineeId;
    models.ClassRecord.unEnrollCourse(traineeId, classId, function () {
        var datasend = {
            success: true,
            msg: 'Un-enroll Course Success'
        }
        res.send(datasend);
    });
});


router.post('/getMyEnrolledClass', function (req, res) {
    var query = {
        include: [{
            model: models.Class,
            include: [models.Course]
        },
        {
            model: models.User,
            where: {
                email: req.body.email
            }
        }
        ]
    };
    models.ClassRecord.findAll(query).then(function (classRecord) {
        var datasend = {
            success: true,
            msg: 'Get Class Record By User Email Success',
            classRecord: classRecord
        }
        res.send(datasend);
    });
});




router.post('/updateClassRecordStatus', function (req, res) {
    // this function check if the user used comment for class
    models.ClassRecord.update({
        status: 'Learned'
    }, {
            where: {
                traineeId: req.body.traineeId,
                classId: req.body.classId
            }
        }).then(function () {
            res.send({
                success: true,
                msg: 'update status success!'
            });
        });
});

router.post('/getCoursebyName', function (req, res) {
    models.Course.getByName(req.body.name, function (result) {
        res.send({
            course: result
        })
    });
});
// get trainee by classId from class_record
router.post('/getTraineeByClassId', function (req, res) {
    var query = {
        include: [{
            model: models.ClassRecord,
            where: {
                confirmJoin: {
                    $or: ['YES', null]
                }
            },
            include: [models.User]
        }]
    };
    models.Class.findAll(query).then((classRecords) => {
        res.send({
            data: classRecords,
            success: true
        })
    });
});


module.exports = router;
