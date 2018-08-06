var _courseModel = require('./DataObjects/Course');
var log = require('../config/config')["log"];
var models = require("./index");

module.exports = function (sequelize) {
    var Course = sequelize.define('Course', _courseModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getNameCoursebyCourseId: function (courseId, cb) {
                var query = {
                    where: {
                        id: courseId
                    }
                }
                Course.findOne(query).then(cb);
            },
            getByID: function (id, cb) {
                var query = {
                    where: {

                        id: id
                    }
                };
                Course.findOne(query).then(cb);
            },

            getByName: function (name, cb) {
                var query = {
                    where: {

                        name: name
                    }
                };
                Course.findOne(query).then(cb);
            },

            getAll: function (cb) {
                Course.findAll().then(cb);
            },

            getCourseByTPID: function (TPID, cb) {
                var query = {
                    where: {
                        trainingProgramId: TPID
                    }
                };

                Course.findAll(query).then(cb);
            },

            deleteCourseByID: function (id, cb) {
                Course.destroy({
                    where: {
                        id: id
                    }
                }).then(cb);
            },
            // method nhóm cũ viết không sử dụng
            // deleteCourseByTPID: function (TPID, cb) {
            //     Course.destroy({
            //         where: {
            //             trainingProgramId: TPID
            //         }
            //     }).then(cb);
            // },
            add: function (name, description, duration, test, documents, trainingProgramID, cb) {
                Course.create({
                    name: name,
                    description: description,
                    duration: duration,
                    test: test,
                    documents: documents,
                    trainingProgramId: trainingProgramID,
                    imgLink: '/img/courses/training-icon-1.svg'
                }).then(cb);
            },
            edit: function (courseDetail, cb) {
                Course.update({
                    name: courseDetail.name,
                    description: courseDetail.description,
                    duration: courseDetail.duration,
                    test: courseDetail.test,
                    documents: courseDetail.documents,
                }, {
                    where: {
                        id: courseDetail.id
                    }
                }).then(cb)
            },

            // Get all courses of a user who don't have feedback by user id
            getCourseOfUserDontFeedbackByUserID: function (userID, cb) {
                sequelize.query('SELECT DISTINCT course.* ' 
                              + ' from course, class_record, user, class '
                              + ' WHERE user.id = class_record.traineeId and class_record.status = "Learned" '
                                        + ' and class_record.traineeId = ' + userID + ' and class.id = class_record.classId '
                                        + ' and class.courseId = course.id '  
                                        + ' and class.id not in (SELECT DISTINCT class.id  '
                                                            + ' from course, class_record, user, class '
                                                            + ' WHERE user.id = class_record.traineeId and class_record.status = "Learned" '
                                                                    + ' and LENGTH(class_record.improve_comments) >= 0 '
                                                                    + ' and class_record.traineeId = ' + userID + ' and class.id = class_record.classId '  
                                                                    + ' and class.courseId = course.id ) ',{ 
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },


            // Get course by class id 
            getCourseByClassID: function (classID, cb) {
                sequelize.query('select course.* '
                             + ' from course, class '
                             + ' where course.id = class.courseId and class.id = ' + classID ,{ 
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },

            // Get course name by class id
            getCourseNameByClassId: function(classID,cb){
                sequelize.query('select course.* '
                            + ' from course, class '
                            + ' WHERE course.id = class.courseId and class.id = ' + classID,{ 
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },
        },
        tableName: 'course',
        timestamps: false
    });
    return Course;
};