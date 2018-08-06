var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];
var sequelize = require('sequelize');
// Upload file setting
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './client/exercises');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
// var upload = multer({
//     storage: storage
// }).single('userPhoto');
var upload = multer({
    storage: storage
}).any();

router.post('/getInfoNotificationByClassId', function(req, res) {
    var query = {
        include: [{
                model: models.Class,
                include: [{
                    model: models.User,
                }],
                where: {
                    id: req.body.classId
                }
        }],
    };
    models.Course.findOne(query).then((data) => {
        var datasend = {
            success: true,
            msg: 'send list success',
            data: data,
        };
        res.send(datasend);
    })
});
router.post('/getClassesThisWeek',function(req,res){
  var startTime = new Date();
  var endTime = new Date();
  startTime.setDate(startTime.getDate()-(startTime.getDay()-1)); // get date of Monday
  endTime.setDate(endTime.getDate()+(7-endTime.getDay())); // get date of Sunday

  startTime.setHours(0);
  startTime.setMinutes(0);
  startTime.setSeconds(0);
  endTime.setHours(23);
  endTime.setMinutes(59);
  endTime.setSeconds(59);

  var query = {
      include: [{
              model: models.ClassRecord,
              where:{
                 traineeId : req.body.traineeId
                 //status: req.body.status
              }
          },
          {
              model: models.Course
          }
      ],
      where:
      {
          $and: [{
                  startTime: {
                    $gte: startTime
                  },
                  endTime: {
                    $lte: endTime
                  }
                }]
      }
  };
  models.Class.findAll(query).then(function (allCourses) {
    //  var allCourses;
    var resData =[];
     allCourses.forEach(allCourse => {
        resData.push({
            id: allCourse.id,
            location:allCourse.location,
            name: allCourse.Course.name,
            imgLink:allCourse.Course.imgLink,
            description: allCourse.Course.description,
            documents: allCourse.Course.documents,
            startTime: allCourse.startTime,
            endTime: allCourse.endTime
        });
      });
      var datasend = {
          success: true,
          msg: 'send list success',
          allCourse: resData,
      };
      res.send(datasend);
  });
});
//get classes Learned
// router.post('/getClassesLearned',function(req,res){
//   var startTime = new Date();
//   var endTime = new Date();
//   startTime.setDate(startTime.getDate()-(startTime.getDay()-1)); // get date of Monday
//   endTime.setDate(endTime.getDate()+(7-endTime.getDay())); // get date of Sunday
//   var query = {
//       include: [{
//               model: models.ClassRecord,
//               where:{
//                  traineeId : req.body.traineeId,
//                  status: req.body.status
//               }
//           },
//           {
//               model: models.Course
//           }
//       ],
//       where:
//       {
//           $and: [{
//                   startTime: {
//                     $gte: startTime
//                   },
//                   endTime: {
//                     $lte: endTime
//                   }
//                 }]
//       }
//   };
//   models.Class.findAll(query).then(function (allCourses) {
//     //  var allCourses;
//     var resData =[];
//      allCourses.forEach(allCourse => {
//         resData.push({
//             id: allCourse.id,
//             location:allCourse.location,
//             name: allCourse.Course.name,
//             imgLink:allCourse.Course.imgLink,
//             description: allCourse.Course.description,
//             documents: allCourse.Course.documents,
//             startTime: allCourse.startTime,
//             endTime: allCourse.endTime
//         });
//       });
//       var datasend = {
//           success: true,
//           msg: 'send list success',
//           allCourse: resData,
//       };
//       res.send(datasend);
//   });
// });
router.post('/getTrainingProgramByTPType', function (req, res) {
    var query = {
        include: [{
                model: models.CourseType,
            },
            {
                model: models.Course,
                include: [{
                    model: models.Class,
                    include: [
                        {
                            model: models.sessionClassTime
                        },
                        {
                            model: models.ClassRecord,
                            include: [models.User],
                        }
                    ]
                }]
            }
        ]
    };
    models.TrainingProgram.findAll(query).then(function (trainingPrograms) {
        var resData = [];
        var checkLearnedOptionalClass;
        trainingPrograms.forEach(trainingProgram => {
            checkLearnedOptionalClass = 0;
            if (trainingProgram.CourseType.name === req.body.userType ||
                trainingProgram.CourseType.name === 'EVERYONE' ||
                (!req.body.isExperienced && trainingProgram.CourseType.name === 'OPTIONAL')) {
                resData.push(trainingProgram);
            } else {
                var resDataCourse = [];
                trainingProgram.Courses.forEach(course => {
                    course.Classes.forEach(classes => {
                        classes.ClassRecords.forEach(classRecord => {
                            if (classRecord.User.email === req.body.email) {
                                checkLearnedOptionalClass = 1;
                                resDataCourse.push(course);
                            }
                        });
                    });
                });
                if (checkLearnedOptionalClass === 1) {
                    resData.push({
                        id: trainingProgram.id,
                        name: trainingProgram.name,
                        description: trainingProgram.description,
                        imgLink: trainingProgram.imgLink,
                        courseTypeId: trainingProgram.courseTypeId,
                        CourseType: trainingProgram.CourseType,
                        Courses: resDataCourse
                    });
                }
            }
        });
        var datasend = {
            success: true,
            msg: 'send list success',
            trainingProgram: resData,
        };
        res.send(datasend);
    });
});
// router.post('/saveFileUpload',function(req,res){
//   //Save file upload
//   upload(req, res, function () {
//       var userid = req.headers.userid;
//       var classid = req.headers.classid;
//       models.ClassRecord.getTraineeClassbyId(userid,classid, function (class_record) {
//           if(class_record){
//           models.ClassRecord.update({
//               exercises: '/exercises/' + req.files[0].filename,
//           }, {
//               where: {
//                   classId: userid,
//                   traineeId:classid
//               }
//           }).then(function () {
//             var datasend = {
//                 success: true,
//                 data: req.files[0].filename
//             };
//             res.send(datasend)
//           });
//         }else{
//           var datasend = {
//               success:false,
//               data: req.files[0].filename
//           };
//           res.send(datasend)
//         }
//       });
//   });
// });
router.post('/getRequestOpenCourse', function (req, res) {
    var query = {
        include: [{
                model: models.Class,
            },
            {
                model: models.RequestOpening,
                where: {
                    userId: req.body.userId
                }
            }
        ]
    };
    models.Course.findAll(query).then(function (course) {
        var datasend = {
            success: true,
            msg: 'send list success',
            data: course
        };

        res.send(datasend);
    });
});

// router.get('/mailEnrollClassResponse', (req, res) => {
//     var response = req.query.response;
//     var email = req.query.email;
//     var courseID = req.query.courseID;
//     var classID = req.query.classID;
//     var hash = req.query.hash;

// // this is callback hell, if you have time, please fix it. Thanks :)

//     // check whatever the user submitted the request
//     models.EmailResponseStatus.findOne({
//         where: {
//             email: email,
//             hash: hash
//         }
//     }).then((emailResponseStatus) => {
//         if (emailResponseStatus) {
//             if (emailResponseStatus.status === 0) {
//                 //update status
//                 models.EmailResponseStatus.updateStatus(email, hash, 1, (result) => {
//                     if (result) {
//                         //email => userID
//                         models.User.getUserByEmail(email, (user) => {
//                             var userID = user.id;
//                             models.RequestOpening.findRequestOpenningCourse(userID, courseID, (requestCourseOpenning) => {
//                                 if (requestCourseOpenning) {
//                                     if (response === 1) { // accept mail
//                                         models.ClassRecord.findTraineeEnrolledClass(userID, classID, (classRecord) => {
//                                             if (!classRecord) {
//                                                 models.Class.findOne({
//                                                     where: {
//                                                         id: classID
//                                                     }
//                                                 }).then(result => {
//                                                     if( Date.parse(result.endTime) > Date.parse(new Date()) ) {
//                                                         models.ClassRecord.create({
//                                                             classId: classID,
//                                                             traineeId: userID,
//                                                             status: "Enrolled"
//                                                         }).then((data) => {
//                                                             if (data) {
//                                                                 res.send("Enroll successful");
//                                                             }
//                                                         });
//                                                     }
//                                                     else {
//                                                         res.send("Your class is closed");
//                                                     }
//                                                 })
//                                             } else {
//                                                 res.send("You enrolled");
//                                             }
//                                         });
//                                     } else {
//                                         models.RequestOpening.deleteRequestOpening(userID, courseID, () => {
//                                             res.send('Delete Request Opening Success');
//                                         });
//                                     }
//                                 } else {
//                                     if (response === 1) { // accept mail
//                                         models.ClassRecord.findTraineeEnrolledClass(userID, classID, (classRecord) => {
//                                             if (!classRecord) {
//                                                 models.Class.findOne({
//                                                     where: {
//                                                         id: classID
//                                                     }
//                                                 }).then(result => {
//                                                     if( Date.parse(result.endTime) > Date.parse(new Date()) ) {
//                                                         models.ClassRecord.create({
//                                                             classId: classID,
//                                                             traineeId: userID,
//                                                             status: "Enrolled"
//                                                         }).then((data) => {
//                                                             if (data) {
//                                                                 res.send("Enroll successful");
//                                                             }
//                                                         });
//                                                     }
//                                                     else {
//                                                         res.send("Your class is closed");
//                                                     }
//                                                 })
//                                             } else {
//                                                 res.send("You enrolled");
//                                             }

//                                         });
//                                     } else {
//                                         res.send("You canceled this class");
//                                     }
//                                 }
//                             })
//                         });
//                     }
//                     else {
//                         res.send("Something wrong, please check your request again!");
//                     }
//                 })

//             } else {
//                 res.send("You have already sent request!");
//             }
//         } else {
//             res.send("Something wrong, please check your request again!");
//         }
//     })

// });

router.post('/enrollClass', function (req, res) {
    models.ClassRecord.create({
        classId: req.body.classId,
        traineeId: req.body.userId,
        status: "Enrolled"
    }).then(function (data) {
        var dataSend = {
            success: true,
            data: data
        }
        res.send(dataSend);
    })
});

router.get('/getDemandOpenCourse', function (req, res) {
    var query = {
        include: [models.RequestOpening]
    };
    // get number to define high demand from adminSetting
    models.Setting.getSettingByName("numberHighDemand", function(setting){
        models.Course.findAll(query).then(function (courses) {
            var resData = [];
            // check if have request openning
            courses.forEach(course => {
                if (course.RequestOpenings.length >= setting.value) {
                    var requestUsers = [];
                    course.RequestOpenings.forEach(request => {
                        requestUsers.push(request.userId);
                    })
                    resData.push({
                        course: {
                            id: course.id,
                            name: course.name,
                            description: course.description,
                            imgLink: course.imgLink,
                        },
                        numberOfRequest: course.RequestOpenings.length,
                        traineeList: requestUsers,
                    })
                }
            });
            var datasend = {
                success: true,
                msg: 'send list success',
                data: resData
            };
            res.send(datasend);
        });
    });
});

router.post('/getClassesNeedToFeedBack', function (req, res) {
    var query = {
        include: [{
                model: models.Course
              },
              {
                model:models.ClassRecord,
                where:{
                  traineeId:req.body.traineeId,
                  status:"Learned",
                  bestThing_comments: null,
                  trainer_rating: null,
                  improve_comments: null,
                  content_rating: null,
                  happy_rating: null
                }
              }]
    };
    models.Class.findAll(query).then(function (allClassFeedback) {
      var resData = [];
      allClassFeedback.forEach(classFeedback => {
          resData.push({
              classId: classFeedback.id,
              name:  classFeedback.Course.name,
              imgLink:   classFeedback.Course.imgLink,
              startTime: classFeedback.startTime,
              endTime: classFeedback.endTime,
              location: classFeedback.location
              });
      });
      var datasend = {
          success: true,
          msg: 'send list success',
          data: resData
      };
      res.send(datasend);
    });
});
module.exports = router;
