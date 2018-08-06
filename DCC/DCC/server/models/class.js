var _classModel = require("./DataObjects/class");

module.exports = function (sequelize) {
    var Class = sequelize.define('Class', _classModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getAllClass: function (cb) {
                Class.findAll().then(cb);
            },
            getOpeningClassByCourseID: function (courseId, cb) {
                var query = {
                    where: {
                        startTime: {
                            $gt: Date.now()
                        },
                        courseId: courseId
                    }
                };
                Class.findOne(query).then(cb);
            },
            getClassByCourseIDByQuery: function (query, res) {
                Class.findAll(query).then(function (classes) {
                    var resData = [];
                    classes.forEach(classByCourseId => {
                        let traineeList = [];
                        let sumTrainerRating = 0;
                        let sumContentRating = 0;
                        let sumHappyRating = 0;
                        let countTrainee = 0;
                        let numOfFeedback = 0;
                        //3 biến sau đây là thừa, có thể dùng biến numOfFeedback thay thế
                        let countContentRating = 0;
                        let countTrainerRating = 0;
                        let countHappyRating = 0;

                        classByCourseId.ClassRecords.forEach(classRecord => {
                            if (classRecord.confirmJoin !== 'NO') {
                                countTrainee++;
                                if (classRecord.trainer_rating != null) {
                                    sumTrainerRating += classRecord.trainer_rating;
                                    countTrainerRating++;
                                }
                                if (classRecord.content_rating != null) {
                                    sumContentRating += classRecord.content_rating;
                                    countContentRating++;
                                }
                                if (classRecord.happy_rating != null) {
                                    sumHappyRating += classRecord.happy_rating;
                                    countHappyRating++;
                                }

                                if (classRecord.happy_rating != null
                                    || classRecord.content_rating != null
                                    || classRecord.happy_rating != null
                                    || classRecord.improve_comments != null) {
                                    numOfFeedback++;
                                }

                                let trainee = {
                                    traineeName: classRecord.User.username,
                                    traineeAvatar: classRecord.User.avatar,
                                    traineeMail: classRecord.User.email,
                                    bestThing_comment: classRecord.bestThing_comments,
                                    trainer_rating: classRecord.trainer_rating,
                                    improve_comment: classRecord.improve_comments,
                                    content_rating: classRecord.content_rating,
                                    happy_rating: classRecord.happy_rating,
                                }
                                traineeList.push(trainee);
                            }
                        });
                        const trainer_ratingAverage = (sumTrainerRating / countTrainerRating).toFixed(2);
                        const content_ratingAverage = (sumContentRating / countContentRating).toFixed(2);
                        const happy_ratingAverage = (sumHappyRating / countHappyRating).toFixed(2);
                        let classDetail = {
                            id: classByCourseId.id,
                            location: classByCourseId.location,
                            trainerId: classByCourseId.User ? classByCourseId.User.id : 1,
                            trainerName: classByCourseId.User ? classByCourseId.User.username : "Not Assigned",
                            startTime: classByCourseId.startTime,
                            endTime: classByCourseId.endTime,
                            trainerAvatar: classByCourseId.User ? classByCourseId.User.avatar : "/img/profiles/defaultProfile.jpg",
                            traineeList: traineeList,
                            maxAttendant: classByCourseId.maxAttendant,
                            trainer_ratingAverage: trainer_ratingAverage,
                            content_ratingAverage: content_ratingAverage,
                            happy_ratingAverage: happy_ratingAverage,
                            numTrainee: countTrainee,
                            numOfFeedback: numOfFeedback,
                            courseId: classByCourseId.courseId
                        }
                        resData.push(classDetail);
                    }); // ket thuc forEach
                    var datasend = {
                        success: true,
                        msg: 'send list success',
                        data: resData
                    };
                    res.send(datasend);
                });
            },
            // getOpenandIncomClassByCourseID: function (courseId, cb) {
            //     var query = {
            //         where: {
            //             $or: [{
            //                     startTime: {
            //                         $gt: Date.now()
            //                     }
            //                 },
            //                 {
            //                     startTime: {
            //                         $lte: Date.now()
            //                     },
            //                     endTime: { //check endTime
            //                         $gt: Date.now()
            //                     }
            //                 }
            //             ],
            //             courseId: courseId
            //         }
            //     };
            //     Class.findAll(query).then(cb);
            // },
            getAllOpenandIncomClass: function (cb) {
                var query = {
                    where: {
                        $or: [{
                            startTime: {
                                $gt: Date.now()
                            }
                        },
                        {
                            startTime: {
                                $lte: Date.now()
                            },
                            endTime: { //check endTime
                                $gt: Date.now()
                            }
                        }
                        ],
                    }
                };
                Class.findAll(query).then(cb);
            },
            getClassByCourseID: function (courseId, cb) {
                var query = {
                    where: {
                        //startTime: {
                        //$gt: Date.now()
                        //},
                        courseId: courseId
                    }
                };
                Class.findAll(query).then(cb);
            },
            getUserInClass: function (classId, cb) {
                sequelize.query('SELECT us.*' +
                    ' FROM class cl, class_record clr, user us ' +
                    'where cl.id = :classId and cl.id = clr.classId and us.id = clr.traineeId', {
                        replacements: {
                            classId: classId
                        },
                        type: sequelize.QueryTypes.SELECT
                    }
                ).then(cb);
            },
            // deleteClassByCourseID: function (courseID, cb) {
            //     Class.destroy({
            //         where: {
            //             courseId: courseID
            //         }
            //     }).then(cb)
            // },
            add: function (objReq, startTime, endTime, cb) {
                Class.create({
                    courseId: objReq.body.courseId,
                    location: objReq.body.location,
                    trainerId: objReq.body.trainer.id,
                    startTime: startTime,
                    endTime: endTime,

                }).then(cb);
            },
            edit: function (id, location, startTime, endTime, cb) {
                Class.update({
                    location: location,
                    startTime: startTime,
                    endTime: endTime,
                    //trainerId: trainerid,
                }, {
                        where: {
                            id: id
                        }
                    }).then(cb);
            },
            getOpeningClassByID: function (id, cb) {
                Class.findOne({
                    where: {
                        id: id,
                        startTime: {
                            $gt: Date.now()
                        }
                    }
                }).then(cb);
            },
            deleteClassByID: function (id, cb) {
                Class.destroy({
                    where: {
                        id: id
                    }
                }).then(cb);
            },
            getClassByID: function (id, cb) {
                Class.findOne({
                    where: {
                        id: id
                    }
                }).then(cb);
            },

            // Find class by user who learned that class
            // getIDClassByUserLearned: function(userID, cb) {
            //     sequelize.query('SELECT class_record.* FROM class_record, user WHERE class_record.status = "Learned" AND class_record.traineeId =' + userID, {
            //         type: sequelize.QueryTypes.SELECT
            //     }).then(cb);
            // },

            // Get content email: location, start time, end time, name of trainner
            getContentEmailFeedBackByClassID: function (classID, cb) {
                sequelize.query(' select class.location, class.startTime, class.endTime, user.username as trainer'
                    + ' from class, user '
                    + ' where class.id = ' + classID + ' and class.trainerId = user.id ', {
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            }
        },
        tableName: 'class',
        timestamps: false
    });
    return Class;
};
