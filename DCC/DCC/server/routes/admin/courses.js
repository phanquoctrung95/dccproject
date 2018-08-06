var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var notification = require('../../notification');
var Job = require('../../automatic');
var _ = require('underscore');
var ics = require('ics');
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
var uuid = require('uuid/v1');
// get all class and trainer
//  return class Array with trainer name and class nam
router.get('/getAllClassFullDetail', function (req, res) {
    models.User.findAll({
        include: [{
            model: models.Class,
            include: [
                models.Course
            ]
        }]
    }).then(function (data) {
        var classList = [];
        for (let i = 0; i < data.length; i++) {
            classList.push(data[i].dataValues);
        }
        res.send({
            success: true,
            data: classList
        });
    })
});

// add course to database
router.post('/addCourse', function (req, res) {
    models.Course.sync({
        force: false
    }).then(function () {
        // this function check if the courseName is already existed
        models.Course.getByName(req.body.name, function (result) {
            if (result) {
                res.send({
                    success: false,
                    msg: 'Name already existed. Add fail!'
                });
            } else {
                models.Course.add(
                    req.body.name,
                    req.body.description,
                    req.body.duration,
                    req.body.test,
                    req.body.documents,
                    req.body.trainingProgramId,
                    function () {
                        res.send({
                            success: true,
                            msg: "Add Course Success"
                        });
                    });
            }
        });
    });
});

// update course in database
router.post('/updateCourse', function (req, res) {
    models.Course.sync({
        force: false
    }).then(function () {
        models.Course.getByName(req.body.name, function (result) {
            if (result) {
                var courseDetail = {
                    id: req.body.id,
                    name: req.body.name,
                    description: req.body.description,
                    duration: req.body.duration,
                    test: req.body.test,
                    documents: req.body.documents,
                }
                models.Course.edit(
                    courseDetail,
                    function () {
                        res.send({
                            success: true,
                            msg: 'Edit course success!'
                        });
                    });
            } else {
                res.send({
                    success: false,
                    msg: 'Name not existed. Update failed!'
                });
            }
        });
    });
});

// destroy Course
router.post('/deleteCourse', function (req, res) {
    models.Class.getClassByCourseID(req.body.id, function (data) {
        if (data.length > 0) {
            res.send({
                success: false,
                msg: 'Delete Course failed'
            });
        } else {
            models.Course.deleteCourseByID(req.body.id, function () {
                res.send({
                    success: true,
                    msg: 'Delete Course success'
                });
            });
        }
    });

});

//getCourseTypeList
router.get('/getCourseTypeList', function (req, res) {
    models.CourseType.getAll(courseTypes => {
        var datasend = {
            success: true,
            msg: 'send list success',
            courseType: courseTypes
        };
        res.send(datasend);
    });
});

router.get('/getTrainingProgramList', function (req, res) {

    var query = {
        include: [{
                model: models.CourseType,
            },
            {
                model: models.Course,
                include: [{
                    model: models.Class,
                    include: [{
                        model: models.ClassRecord,
                    }]
                }]
            }
        ]
    };
    models.TrainingProgram.findAll(query).then(function (trainingProgram) {
        var datasend = {
            success: true,
            msg: 'send list success',
            trainingProgram: trainingProgram
        };
        res.send(datasend);
    });
});

//Add Training programs
router.post('/addTrainingProgram', function (req, res) {
    log.info('/admin/courses/addTrainingProgram: Add Training Program :' + req.body.name);
    // this function check if the courseName is already existed
    models.TrainingProgram.getTrainingByName(req.body.name, function (result) {
        if (result) {
            res.send({
                success: false,
                msg: 'Name already existed. Add fail!'
            });
        } else {
            models.TrainingProgram.add(
                req.body.name,
                req.body.description,
                req.body.courseTypeId.id,
                function () {
                    res.send({
                        success: true,
                        msg: "Add Training Program Success"
                    });
                });
        }
    });

});

//Updtae Training Program
router.post('/updateTrainingProgram', function (req, res) {
    log.info('/admin/updateTrainingProgram: Update Training Program :' + req.body.Name);
    models.TrainingProgram.getTrainingByName(req.body.name, function (result) {
        if (result) {
            models.TrainingProgram.edit(
                req.body.id,
                req.body.name,
                req.body.description,
                req.body.courseTypeId.id,
                function () {
                    res.send({
                        success: true,
                        msg: "Updating Training Program Successes"
                    });
                });

        } else {
            res.send({
                success: false,
                msg: 'Name not existed. Updating Training Program Failed!',
                msg0: req.body.id
            });
        }
    });
});

//delete Training Program
router.post('/deleteTrainingProgram', function (req, res) {
    log.info('Get Delete Command');
    models.Course.getCourseByTPID(req.body.id, function (data) {
        if (data.length > 0) {
            res.send({
                success: false,
                msg: 'Delete Training Program failed'
            });
        } else {
            models.TrainingProgram.deleteTrainingProgramByID(req.body.id, function () {
                res.send({
                    success: true,
                    msg: 'Delete Training Program success'
                });
            });
        }
    });

});

//Get Class
router.post('/getClass', function (req, res) {

    var query = {
        include: [{
            model: models.Course
        }],
        where: {
            courseId: req.body.courseId
        }
    };
    models.Class.findAll(query).then(function (Class) {
        var datasend = {
            success: true,
            msg: 'send list success',
            Class: Class
        };
        res.send(datasend);
    });
});
//add class
router.post('/addClass', function (req, res) {
    var dataSend = {};
    var flgCheck = 0;
    var classID = 0;

    models.Class.getAllOpenandIncomClass(
        function (result) {
            flgCheck = models.ClassRecord.checkAvailableAddClass(result, req);
            // cancel add class
            if (flgCheck === -1) {
                dataSend = {
                    success: false,
                    msg: "Your class can't be added because of having a class in time frame at one location."
                }
                return res.send(dataSend);
            } else if(req.body.courseId == null){
              dataSend = {
                  success: false,
                  msg: "not found courseId"
              }
              return res.send(dataSend);
            } else { // add class
              let courseName;
              req.body.arrayClassTime.forEach( arrayClassTime => {
                  models.Class.add(req, arrayClassTime.starttime, arrayClassTime.endtime,
                      function(newClass) {
                          if (newClass) {
                              classID = newClass.dataValues.id;
                              // neu ma goi thi chac goi cho nay  arrayClassTime
                              // ta can them cai goi la ClassID tai thoi diem do
                                      models.sessionClassTime.addSessionClassTime(newClass.dataValues.id, req.body.arrayClassTime, newSessionClassTime => {
                                          models.Course.getByID(req.body.courseId, course => {
                                              if (course) {
                                                  var date = new Date(arrayClassTime.starttime);
                                                  if (date.getDay() == 1) {
                                                      date.setDate(date.getDate() - 3);
                                                  } else if (date.getDay() == 0) {
                                                      date.setDate(date.getDate() - 2);
                                                  } else {
                                                      date.setDate(date.getDate() - 1);
                                                  }
                                                  courseName = course.name;
                                                  // set content of email to send
                                                  var contentEmail = models.Notifications.setContentEmail(course, req, settings, classID)
                                                  //auto add all requeter to class and noti to them that they have been added to class
                                                  models.RequestOpening.findAll({ // find all requester
                                                      include: models.User,
                                                      where: {
                                                          courseId: req.body.courseId,
                                                      }
                                                  }).then(requesterResults => {
                                                      if (requesterResults) {
                                                          // get requester and members have been invited
                                                          const Requester = requesterResults.map(requester => requester.User);
                                                          let bothUser = Requester;
                                                          if (req.body.specificAttendant) {
                                                              bothUser = Requester.concat(req.body.specificAttendant);
                                                          }
                                                          // filter to get unique member
                                                          bothUser = _.uniq(bothUser, user => user.id);
                                                          // add them to class
                                                          bothUser.forEach(userRequest => {
                                                              models.ClassRecord.enrollCourse(userRequest.id, newClass.dataValues.id, (newClassRecord) => {
                                                                  // delete request of him/her if has.
                                                                  if (newClassRecord) {
                                                                      models.RequestOpening.deleteRequestOpening(userRequest.id, req.body.courseId, () => {
                                                                          const contentNoti = "You have been added to class " + courseName + ". Please check your calendar and course detail to get more information.";
                                                                          const refer = 'detail_notification/' + newClass.dataValues.id;
                                                                          // noti to traine and send mail if has
                                                                          makeFileCalendar();
                                                                          notification([userRequest.email],[userRequest.id], courseName, contentNoti, contentEmail, refer, 1, 1);
                                                                          const contentSessionNoti =
                                                                              "Your " + req.body.courseId + " class has been openned and scheduled to start tomorrow at location: " + req.body.location + ". Please be on time, thank you.";
                                                                          // noti before class open
                                                                          Job.job_sendnoti_ClassStart(date, newSessionClassTime.id, course.name, contentSessionNoti, refer);
                                                                      });
                                                                      dataSend = {
                                                                           success: true,
                                                                           msg: "Add class successfully",
                                                                           idClass:classID
                                                                       }
                                                                       res.send(dataSend);
                                                                  }                                                           
                                                              });
                                                          });
                                                      }
                                                  });
                                              }
                                          });
                                      });  
                          }               
                      });
              }); 
          }
        });
});

function checkNotSuitableTime(req) {
    return Date.parse(req.body.startTime) >= Date.parse(req.body.endTime);
}

//Edit Class
router.post('/editClass', function (req, res) {
    var dataSend = {};
    var flgCheck = 0;
    var classModify = {};
    const dataSend0 = {
        success: false,
        msg: "Add class failed"
    }
    // get all class opening and incoming to check with new class
    models.Class.getAllOpenandIncomClass(
        function (result) {
            if (Date.now() >= Date.parse(req.body.startTime) ||
                checkNotSuitableTime(req)) {
                flgCheck = -1;
             }
            // cancel edit class
            if (flgCheck === -1) {
                dataSend = {
                    success: false,
                    msg: "Your class can't be edited."
                }
                res.send(dataSend);
            } else { // edit class
                //get old data
                var backupData;
                var query = {
                    include: [{
                        model: models.User
                    }],
                    where: {
                        id: req.body.classid
                    }
                }
                models.Class.findOne(query).then(
                    function (result) {
                        classModify = result;
                        backupData = result;
                        var contentEditClass = {
                            courseName: "",
                            description: "",
                            host: "",
                            courseID: 0,
                            ClassId: req.body.classid,

                            oldLocation: backupData.location,
                            oldStartTime: backupData.startTime,
                            oldEndTime: backupData.endTime,
                            oldTrainer: backupData.User ? backupData.User.username : '',

                            newLocation: req.body.location,
                            newStartTime: req.body.startTime,
                            newEndTime: req.body.endTime,
                          //ewTrainer: req.body.trainer.username

                        }
                        var courseName;
                        models.Class.edit(
                            req.body.classid,
                            req.body.location,
                            req.body.startTime,
                            req.body.endTime,
                          // req.body.trainer.id,
                            newClass => {
                                if (newClass) {
                                    var classID = req.body.classid;
                                            models.sessionClassTime.editSessionTime(req.body.classid, req.body.startTime, req.body.endTime, newSessionClassTime => {
                                                models.Course.getByID(req.body.courseId, course => {
                                                    if (course) {
                                                        var date = new Date(req.body.startTime);
                                                        date.setDate(date.getDate() - 1);
                                                        courseName = course.name;
                                                        var contentEmail = {
                                                            courseName: courseName,
                                                            description: course.description,
                                                            startTime: req.body.startTime,
                                                            endTime: req.body.endTime,
                                                            location: req.body.location,
                                                            host: settings.host,
                                                            //trainer: req.body.trainer.username,
                                                            courseID: course.id,
                                                            classID: classID
                                                        };
                                                        //equal some parameters for contentEditClass
                                                        contentEditClass.courseName = courseName;
                                                        contentEditClass.description = course.description;
                                                        contentEditClass.host = settings.host;
                                                        contentEditClass.courseID = course.id;

                                                        //noti to all old member after edit class success
                                                        let specificAttendant = req.body.specificAttendant ? req.body.specificAttendant.length : 0
                                                        let newAttendant = req.body.newAttendant ? req.body.newAttendant.length : 0
                                                        var totalOldTrainee = specificAttendant - newAttendant;
                                                        for (let index = 0; index < totalOldTrainee; index++) {
                                                            notification([req.body.specificAttendant[index].email], [req.body.specificAttendant[index].id], courseName, "Class " + courseName + " have been edited. Please check your calendar and course detail to get more information.", contentEmail, 'detail_notification/' + classID, 1);
                                                        }
                                                        //auto add new attendees to class and noti to them that they have been added to class
                                                        if (req.body.newAttendant) {
                                                            //for (let i = 0; i < req.body.newAttendant.length; i++) {
                                                            req.body.newAttendant.forEach(newAttendant => {
                                                                models.ClassRecord.create({
                                                                    status: "Enrolled",
                                                                    classId: classID,
                                                                    traineeId: newAttendant.id
                                                                }).then(function(newClassRecord) {
                                                                    // delete request of him/her to this class if add to class success.
                                                                    if (newClassRecord) {
                                                                        // delete request opening
                                                                        models.RequestOpening.destroy({
                                                                            where: {
                                                                                courseId: req.body.courseId,
                                                                                userId: newAttendant.id
                                                                            }
                                                                        }).then(() => {
                                                                            // noti to all new member after add them to class
                                                                            notification([newAttendant.email],[newAttendant.id], courseName,
                                                                                "You have been added to class " + courseName + ". Please check your calendar and course detail to get more information.",
                                                                                contentEmail, 'detail_notification/' + classID, 1);
                                                                        });
                                                                    }
                                                                    else {
                                                                        dataSend = {
                                                                            success: false,
                                                                            msg: "Edit class failed"
                                                                        }
                                                                        return res.send(dataSend);
                                                                    }
                                                                });
                                                            }); // ket thuc forEach
                                                        }
                                                        if (req.body.delAttendant) {
                                                            //for (let i = 0; i < req.body.delAttendant.length; i++) {
                                                            req.body.delAttendant.forEach( delAttendant => {
                                                                models.ClassRecord.destroy({
                                                                    where: {
                                                                        classId: classID,
                                                                        traineeId: delAttendant.id
                                                                    }
                                                                }).then(function(newClassRecord) {
                                                                    // delete request of him/her to this class if remove from class success.
                                                                    if (newClassRecord) {
                                                                        // delete request opening
                                                                        models.RequestOpening.destroy({
                                                                            where: {
                                                                                courseId: req.body.courseId,
                                                                                userId: delAttendant.id
                                                                            }
                                                                        }).then(() => {
                                                                            // noti to all member after remove them from class
                                                                            contentEmail = {
                                                                                courseName: courseName,
                                                                                description: course.description,
                                                                                startTime: backupData.startTime,
                                                                                endTime: backupData.endTime,
                                                                                location: backupData.location,
                                                                                host: settings.host,
                                                                                trainer: backupData.User || backupData.User.username,
                                                                                courseID: course.id,
                                                                                classID: classID
                                                                            }
                                                                            notification([delAttendant.email], [delAttendant.id], courseName, `You have been removed from class ${courseName}. Please contact your admin to get more information.`, contentEmail, 'courseDetail/' + course.name, 5);
                                                                        });
                                                                    } else {
                                                                        res.send(dataSend0);
                                                                    }
                                                                });
                                                            }); // ket thuc forEach
                                                        }
                                                        dataSend = {
                                                            data: classModify,
                                                            success: true,
                                                            msg: "Edit class successfully"
                                                        }
                                                        res.send(dataSend);
                                                        makeFileCalendar();
                                                        Job.job_sendnoti_ClassStart(date, newSessionClassTime.id, course.name, "Your " + req.body.courseId + " class has been open and scheduled to start tomorrow at location: " + req.body.location + ". Please be on time, thank you.", 'detail_notification/' + classID);
                                                    } else {
                                                        res.send(dataSend0)
                                                    }
                                                });
                                            });
                                } else {
                                    res.send(dataSend0);
                                }
                            });
                            // edit success
                    });
            }
        });
});
//Update Class
router.post('/updateClass', function (req, res) {
    log.info('/admin/updateClass: update Class :' + req.body.id);
    //  need add trainee to class record
    models.Class.sync({
        force: false
    }).then(function () {
        models.Class.edit(
            req.body.courseId,
            req.body.location,
            req.body.startTime,
            req.body.endTime,
            function () {
                res.send({
                    success: true,
                    msg: 'Edit Class Info success!'
                });
            });
    });
});

// Delete Class
router.post('/deleteClass', function (req, res) {
    models.Class.getOpeningClassByID(
        req.body.id,
        cb => {
            if (cb) {
                models.sessionClassTime.deleteSessionTime(
                    req.body.id,
                    function (idSessionClass) {
                        models.ClassRecord.destroy({
                            where: {
                                classId: idSessionClass
                            }
                        }).then(() => {
                            makeFileCalendar();
                        });
                        models.Class.deleteClassByID(idSessionClass, function () {
                            // warning it not delete row, just change classId to null
                            // and i dont know why ~~
                            res.send({
                                success: true,
                                msg: 'Delete Class success'
                            });
                        });
                    });
            } else {
                models.sessionClassTime.deleteSessionTime(
                    req.body.id,
                    function (idSessionClass) {
                        models.Class.deleteClassByID(idSessionClass, function () {
                            makeFileCalendar();
                            res.send({
                                success: true,
                                msg: 'Delete Class success'
                            });
                        });
                    });
            }
        });

});

router.get('/getAllTrainer', function (req, res) {
    models.User.findAll({
        where: {
            isTrainer: true,
            status: 'activated'
        }
    }).then(function (trainer) {
        var datasend = {
            success: true,
            msg: 'send list success',
            trainer: trainer
        };
        res.send(datasend);
    });
});

router.get('/getAllCourse', function (req, res) {
    models.Course.getAll(data => {
        var datasend = {
            success: true,
            msg: "get all courses done",
            data: data
        };
        res.send(datasend);
    });
});

router.get('/getAllTP', function (req, res) {
    models.TrainingProgram.getAll(data => {
        var datasend = {
            success: true,
            msg: "get all training programs done",
            data: data
        };
        res.send(datasend);
    });
});

function makeFileCalendar() {
        models.ClassRecord.findAll({
            include: [{
                model: models.Class,
                include: [{
                    model: models.Course
                }]
            }],
            where: {
                classId: {
                    $ne: null
                },
                status: 'Enrolled'
            }
        }).then(function (courseList) {
            // day chinh la noi ma chung ta can xu ly
            var events = [];
            var countEvents = 0;
            courseList.forEach(course => {
                if (course.Class) {
                    let subEvent = {};
                    const starttime = new Date(course.Class.startTime);
                    const endtime = new Date(course.Class.endTime);
                    subEvent.id = course.Class.id;
                    subEvent.title = course.Class.Course.name;
                    subEvent.start = [starttime.getFullYear(), starttime.getMonth() + 1, starttime.getDate(), starttime.getHours(), starttime.getMinutes()];
                    subEvent.end = [endtime.getFullYear(), endtime.getMonth() + 1, endtime.getDate(), endtime.getHours(), endtime.getMinutes()];
                    subEvent.location = course.Class.location;
                    events.push(subEvent);
                }
            });
            for (let i = 0; i < courseList.length; i++)
                if (courseList[i].Class && courseList[i].Class.Course)
                    countEvents++;
            var eventFilter = _.uniq(events, event => event.id);
            eventFilter.map((value) => {
                delete value.id;
                return value;
            });
            //make ics file
            var temp = ics.createEvent(eventFilter[0]).value;

            var index = temp.search("END:VCALENDAR");
            var contentICSfile = temp.substring(0, index);
            for (let i = 1; i < eventFilter.length; i++) {
                const value = ics.createEvent(eventFilter[i]).value;
                contentICSfile = contentICSfile + "BEGIN:VEVENT\r\n"
                contentICSfile = contentICSfile + "UID:" + uuid() + "\r\n";
                let indexOfstart = value.search("SUMMARY");
                let indexOfend = value.search("END:VCALENDAR");
                contentICSfile = contentICSfile + value.substring(indexOfstart, indexOfend);
            }
            contentICSfile = contentICSfile + "END:VCALENDAR";
            fs.writeFileSync(`client/calendar/event.ics`, contentICSfile);
        });
    }

module.exports = router;