var _classrecordModel = require('./DataObjects/classRecord');
var _ = require('underscore');
module.exports = function (sequelize) {
    var Classrecord = sequelize.define('ClassRecord', _classrecordModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            unEnrollCourse: function (traineeId, classId, cb) {
                var query = {
                    where: {
                        classId: classId,
                        traineeId: traineeId
                    },
                };
                Classrecord.destroy(query).then(cb);
            },
            enrollCourse: function (traineeId, classId, cb) {
                var query = {
                    traineeId: traineeId,
                    classId: classId,
                    status: "Enrolled",
                };

                Classrecord.create(query).then(cb);
            },
            findTraineeEnrolledClass: function (traineeId, classId, cb) {
                var query = {
                    where: {
                        traineeId: traineeId,
                        classId: classId,
                        status: 'Enrolled'
                    }
                };
                Classrecord.findOne(query).then(cb);
            },
            getTraineeClassbyId: function (traineeId, classId, cb) {
                var query = {
                    where: {
                        traineeId: traineeId,
                        classId: classId
                    }
                };
                Classrecord.findOne(query).then(cb);
            },
            getClassRecordByClassID: function (classID, cb) {
                sequelize.query('select class_record.*, user.*  '
                    + ' from class_record, class, user '
                    + ' where class_record.classId = class.id and class_record.traineeId = user.id and class.id = ' + classID, {
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },
            getClassRecordByCourseTypeID: function (courseTypeID, cb) {
                sequelize.query('select class_record.* '
                    + ' from class_record, class, training_program, course_type, course '
                    + ' where course_type.id = training_program.courseTypeId '
                    + ' and training_program.id = course.trainingProgramId '
                    + ' and course.id = class.courseId '
                    + ' and class.id = class_record.classId and course_type.id = ' + courseTypeID, {
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },
            getClassRecordByTrainerId: function(trainerId,cb){
            
                sequelize.query('SELECT class_record.trainer_rating FROM `class`,`class_record` WHERE class.id = class_record.classId AND class.trainerId = ' +  trainerId, {
                    type: sequelize.QueryTypes.SELECT
                }).then(cb);
            },
            getTimeOfClassRecordWithStatusEnrolled: function(cb){
                sequelize.query(`select class.startTime, class.endTime ,class_record.* from class,class_record where class_record.classId = class.id AND class_record.status = 'Enrolled' and (class_record.confirmJoin = 'YES' or class_record.confirmJoin IS NULL) `,{
                    type:sequelize.QueryTypes.SELECT
                }).then(cb);
            },
            checkAvailableAddClass: (objArrayCurrClass, objReq) => {
                let flgCheck = 0;
                // too late to add class
                if (Date.now() >= Date.parse(objReq.body.startTime)) {
                    flgCheck = -1;
                } else { //else
                    // filt with all class
                    for (let i = 0; i < objArrayCurrClass.length; i++) {
                        for (var y = 0; y < objReq.body.arrayClassTime.length; y++) {
                            //Removed this useless assignment to local variable "flagCollapseTime"
                            //const flagCollapseTime = (Date.parse(objArrayCurrClass[i].endTime) >= Date.parse(objReq.body.arrayClassTime[y].starttime)) &&
                            //(Date.parse(objArrayCurrClass[i].startTime) <= Date.parse(objReq.body.arrayClassTime[y].starttime));
                            const flagLocation = objArrayCurrClass[i].location === objReq.body.location;
                            if (flagLocation &&
                                // H.Loc: Thoi gian KET THUC trung nhau
                                ((Date.parse(objArrayCurrClass[i].endTime) === Date.parse(objReq.body.arrayClassTime[y].endtime)) ||
                                    // H.Loc: Thoi gian KET THUC cua lop da co trung voi thoi gian BAT DAU cua lop them vao
                                    //(Date.parse(objArrayCurrClass[i].endTime) === Date.parse(objReq.body.arrayClassTime[y].starttime)) ||
                                    // H.Loc: Thoi gian BAT DAU cua lop da co trung voi thoi gian KET THUC cua lop them vao
                                    //(Date.parse(objArrayCurrClass[i].startTime) === Date.parse(objReq.body.arrayClassTime[y].endtime)) ||
                                    // H.Loc: Thoi gian BAT DAU cua lop da co trung voi thoi gian BAT DAU cua lop them vao
                                    (Date.parse(objArrayCurrClass[i].startTime) === Date.parse(objReq.body.arrayClassTime[y].starttime)) ||
                                    // H.Loc: Thoi gian 2 lop bi chong len nhau
                                    ((Date.parse(objArrayCurrClass[i].endTime) >= Date.parse(objReq.body.arrayClassTime[y].endtime)) && (Date.parse(objArrayCurrClass[i].startTime) <= Date.parse(objReq.body.arrayClassTime[y].endtime))) ||
                                    // H.Loc: Thoi gian 2 lop bi chong len nhau
                                    ((Date.parse(objArrayCurrClass[i].endTime) >= Date.parse(objReq.body.arrayClassTime[y].starttime)) && (Date.parse(objArrayCurrClass[i].startTime) <= Date.parse(objReq.body.arrayClassTime[y].starttime)))
                                )) {
                                flgCheck = -1;
                            }
                            else {
                                flgCheck = 0;
                            }
                        }
                        if (flgCheck === -1) {
                            break;
                        }
                    }
                }
                return flgCheck;
            },

            getCourseListByQuery: function (query, res) {
                Classrecord.findAll(query).then(function (courseList) {
                    // day chinh la noi ma chung ta can xu ly
                    var events = [];
                    courseList.forEach(course => {
                        if (course.Class) {
                            let subEvent = {};
                            subEvent.id = course.Class.id;
                            subEvent.title = course.Class.Course.name;
                            subEvent.description = course.Class.Course.description;
                            subEvent.start = course.Class.startTime;
                            subEvent.end = course.Class.endTime;
                            subEvent.location = course.Class.location;
                            events.push(subEvent);
                        }
                    });
                    var eventFilter = _.uniq(events, event => event.id);

                    var datasend = {
                        success: true,
                        msg: 'send list success',
                        data: eventFilter
                    };
                    res.send(datasend);
                });
            }
        },
        tableName: 'class_record',
        timestamps: false
    });
    return Classrecord;
};
