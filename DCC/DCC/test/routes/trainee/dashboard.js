var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
process.env.NODE_ENV = settings.testDatabase;
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');

describe('<Unit test for trainee-dashboard>', function () {
    var Cookies;
    var Token;
    beforeEach(function (done) {
        request(DCC_Server)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'qwe@gmail.com',
                password: 'qwe'
            })
            .end(function (err, res) {
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                Token = res.body.token;
                if (err)
                    return done(err);
                done();
            });
    });

    afterEach(function (done) {
        // Cleanup

        //logout
        request(DCC_Server).get('/logout')
        done();
    });

    describe('Test case 1.1 : Get training programs by TP Type: CBA', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                userType: 'CBA',
                isExperienced: '0',
                email: 'qwe@gmail.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.2 : Get training programs by TP Type: IMS', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                userType: 'IMS',
                isExperienced: '0',
                email: 'qwe@gmail.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.3 : Get training programs by TP Type: experienced', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                userType: 'IMS',
                isExperienced: '1',
                email: 'qwe@email.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.4 : Get training programs by TP Type: experienced and CourseType do not contain name send by user', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                userType: 'IMS1',
                isExperienced: '1',
                email: 'qwe@email.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.5 : Get training programs by TP Type: Optional,isExperienced=0 and mail of traniee is as same as req.body.email', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            models.Class.create({
                id: 5,
                location: '3-B',
                courseId: 5,
                startTime: '2019-11-19 02:35:30.000 +00:00'
            });
            models.ClassRecord.create({
                id: 8,
                status: 'Enrolled',
                classId: 5,
                traineeId: 6
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                traineeId: 6,
                userType: 'Intern',
                isExperienced: '1',
                email: 'thong@gmail.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
                models.ClassRecord.destroy({
                    where:{
                        id: 8
                    }
                });
                models.Class.destroy({
                    where:{
                        id: 5
                    }
                });
            });
        });
    });
    describe('Test case 1.6 : Get training programs by TP Type: Optional,isExperienced=0 and mail of traniee is NOT as same as req.body.email', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getTrainingProgramByTPType');
            models.Class.create({
                id: 5,
                location: '3-B',
                courseId: 5,
                startTime: '2019-11-19 02:35:30.000 +00:00'
            });
            models.ClassRecord.create({
                id: 8,
                status: 'Enrolled',
                classId: 5,
                traineeId: 6
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                traineeId: 6,
                userType: 'Intern',
                isExperienced: '1',
                email: 'TEST@gmail.com',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
                models.ClassRecord.destroy({
                    where:{
                        id: 8
                    }
                });
                models.Class.destroy({
                    where:{
                        id: 5
                    }
                });
            });
        });
    });
    describe('Test case 2: Get Info Notification by Class ID', function () {
        return it('Should return success = true', function (done) {
            models.Course.create({
              id: 40,
              name: 'Training Policy',
              description: 'Study some policies of company',
              duration: '00:00:00',
              test: 'Update some documents',
              documents: 'Update some documents',
              trainingProgramId: 1,
              imgLink: '/img/courses/training-icon-3.svg',
            });
            models.Class.create({
              id: 50,
              location: '4F',
              courseId: 40,
              trainerId:4,
              startTime: '2017-12-28T11:00:30.000Z',
              endTime: '2017-12-28T12:00:30.000Z'
            });
            var req = request(DCC_Server).post('/trainee/dashboard/getInfoNotificationByClassId')
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
               classId : 50
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Class.destroy({
                  where:{
                    id:50
                  }
                });
                models.Course.destroy({
                    where: {
                        id: 40
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 3: Enroll class', function () {
        return it('Should return success = true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/enrollClass')
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                userId: 3,
                classId: 2
                    })
            req.end(function (err, res) {
                assert.equal(res.body.success, true)
                if (err) return done(err)
                done()
            });
        });
    });
    describe('Test case 4: Get demand open course while number of request open for all of courses < 3', function () {
        return it('Should return success = true', function (done) {
            var req = request(DCC_Server).get('/trainee/dashboard/getDemandOpenCourse')
            models.RequestOpening.create({
              id:100,
              userId: 2,
              courseId: 4,
              requestType: "register",
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send();
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.RequestOpening.destroy({
                  where:{
                    id:100
                  }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4.1: Get demand open course while number of request open for one of a courses >= 3', function () {
        return it('Should return success = true', function (done) {
            var req = request(DCC_Server).get('/trainee/dashboard/getDemandOpenCourse')
            models.RequestOpening.create({
              id:3,
              userId: 1,
              courseId: 2,
              requestType: "register",
            });
            models.RequestOpening.create({
              id:4,
              userId: 3,
              courseId: 2,
              requestType: "register",
            });
            models.RequestOpening.create({
              id:5,
              userId: 4,
              courseId: 2,
              requestType: "register",
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send();
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.RequestOpening.destroy({
                  where:{
                    id:3
                  }
                });
                models.RequestOpening.destroy({
                  where:{
                    id:4
                  }
                });
                models.RequestOpening.destroy({
                  where:{
                    id:5
                  }
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 5: Get class need to feedback', function () {
        return it('Should return success = true', function (done) {
            var req = request(DCC_Server).post('/trainee/dashboard/getClassesNeedToFeedBack')
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
              traineeId:1
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 6 : Get request open course', function () {
        return it('Should return success==true', function (done) {
            //Create User, Course,RequestOpening
            models.User.create({
                id:100,
                username: "Tien Bui",
                status: 'activated',
                dob: '02/02/1996',
                phone: '0000 000 000',
                location: 'DEK Vietnam',
                email: "tien@gmail.com",
                avatar: '/img/profiles/defaultProfile.jpg',
                isAdmin: false,
                isTrainer: false,
                isTrainee: true,
                belong2Team: "Team 5",
                isExperienced: 0,
                userType: "Intern",
            })
            models.Course.create({
              id: 45,
              name: 'Training Policy',
              description: 'Study some policies of company',
              duration: '00:00:00',
              test: 'Update some documents',
              documents: 'Update some documents',
              trainingProgramId: 1,
              imgLink: '/img/courses/training-icon-3.svg',
            });
            models.Class.create({
              id: 60,
              location: '4F',
              courseId: 45,
              trainerId:4,
              startTime: '2017-12-28T11:00:30.000Z',
              endTime: '2017-12-28T12:00:30.000Z'
            });
            models.RequestOpening.create({
              id: 90,
              userId: 100,
              courseId: 45,
              requestType: "register",
              requestTime: Date.now()
            });
            var req = request(DCC_Server)
                .post('/trainee/dashboard/getRequestOpenCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ userId:100});
            req.end(function (err, res) {
                assert.notEqual(res.body.data.length,0);
                models.RequestOpening.destroy({
                  where:{
                    id:90
                  }
                });
                models.Class.destroy({
                  where:{
                    id:60
                  }
                });
                models.User.destroy({
                  where:{
                    id:100
                  }
                });
                models.Course.destroy({
                  where:{
                    id:45
                  }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    // describe('Test case 7: save file upload successfully', function () {
    //     return it('Should return success==true', function (done) {
    //         //create traineeId
    //         models.User.create({
    //             id:150,
    //             username: "Tien Bui",
    //             status: 'activated',
    //             dob: '02/02/1996',
    //             phone: '0000 000 000',
    //             location: 'DEK Vietnam',
    //             email: "tien@gmail.com",
    //             avatar: '/img/profiles/defaultProfile.jpg',
    //             isAdmin: false,
    //             isTrainer: false,
    //             isTrainee: true,
    //             belong2Team: "Team 5",
    //             isExperienced: 0,
    //             userType: "Intern",
    //         })
    //         models.ClassRecord.create({
    //             id:40,
    //             status: "Enrolled",
    //             classId:2,
    //             traineeId: 150
    //         });
    //         var file1 ={filename:"Hello.docx"};
    //         var files =[];
    //         files.push(file1);
    //         var req = request(DCC_Server).post('/trainee/dashboard/saveFileUpload').attach('docx', './client/documents/bananaInternship/howToPeelABanana.docx');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.set('userid',150);
    //         req.set('classid',2);
    //         req.send();
    //         req.end(function (err, res) {
    //             assert.equal(res.body.success, true);
    //             fs.unlink('./client/exercises/'+res.body.data);
    //             models.ClassRecord.destroy({
    //               where:{
    //                 id:40
    //               }
    //             });
    //             models.User.destroy({
    //               where:{
    //                 id:150
    //               }
    //             });
    //             if (err) return done(err);
    //             done();
    //         });
    //     });
    // });
    // describe('Test case 7.1: fail to save file upload', function () {
    //     return it('Should return success==false', function (done) {
    //         //create traineeId
    //         models.User.create({
    //             id:150,
    //             username: "Tien Bui",
    //             status: 'activated',
    //             dob: '02/02/1996',
    //             phone: '0000 000 000',
    //             location: 'DEK Vietnam',
    //             email: "tien@gmail.com",
    //             avatar: '/img/profiles/defaultProfile.jpg',
    //             isAdmin: false,
    //             isTrainer: false,
    //             isTrainee: true,
    //             belong2Team: "Team 5",
    //             isExperienced: 0,
    //             userType: "Intern",
    //         })
    //         var file1 ={filename:"Hello.docx"};
    //         var files =[];
    //         files.push(file1);
    //         var req = request(DCC_Server).post('/trainee/dashboard/saveFileUpload').attach('docx', './client/documents/bananaInternship/howToPeelABanana.docx');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.set('userid',150);
    //         req.set('classid',2);
    //         req.send();
    //         req.end(function (err, res) {
    //             assert.equal(res.body.success, false);
    //             fs.unlink('./client/exercises/'+res.body.data);
    //             if (err) return done(err);
    //             done();
    //             models.User.destroy({
    //               where:{
    //                 id:150
    //               }
    //             });
    //         });
    //     });
    // });

    describe('Test case 8: get classes this week', function () {
        return it('Should return length of list of classes > 0', function (done) {
          var req = request(DCC_Server).post('/trainee/dashboard/getClassesThisWeek')
          var endTime = new Date();
          endTime.setDate(endTime.getDate()+1);
          models.Class.create({
            id: 60,
            location: '4F',
            courseId: 4,
            trainerId: 4,
            startTime : Date.now(),
            endTime: endTime
          });
          models.ClassRecord.create({
              id: 40,
              status: 'Enrolled',
              classId: 60,
              traineeId: 3
          });
          req.cookies = Cookies;
          req.set('x-access-token', Token);
          req.send({
            traineeId: 3,
            status: 'Enrolled'
          });
          req.end(function (err, res) {
              assert.notEqual(res.body.allCourse.length, 0);
              if (err) return done(err);
              done();
              models.ClassRecord.destroy({
                where: {
                    id: 40
                }
              });
              models.Class.destroy({
                where: {
                    id: 60
                }
              });
          });
      });
    });
    // describe('Test case 5: Mail Enroll Class Response', function () {
    //     return it('Should return success = true', function (done) {
    //         var req = request(DCC_Server).post('/trainee/dashboard/mailEnrollClassResponse')
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.send({
    //            email : 'huy@gmail.com',
    //            hash: 'b076973e3c127b409b91f6c55fd6888801d1ac9f50b0f5484e2475422b125064ba3a1164b504c8a57b0312213569f43ad8ac9c2090929473cac077e810718af1d476417b4d25e8d0f592f2780a2520d92185beeeea27ee8fb4ad2d4a4b17d9e95791cb7a'
    //         })
    //         req.end(function (err, res) {
    //             assert.equal(res.body.success, true)
    //             if (err) return done(err)
    //             done()
    //         })
    //     })
    // })
});
