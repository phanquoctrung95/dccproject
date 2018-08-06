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

describe('<Unit test for admin-course>', function () {
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

    describe('Test case 0 : get /admin/course/getAllClassFullDetail with get success', function(){
        return it('Should return success==true', function(done){
            var req = request(DCC_Server).get('/admin/courses/getAllClassFullDetail');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1 : Post /admin/courses/addCourse with add success', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                name: 'test creat name course',
                description: 'test creat name description',
                duration: '00:00:00',
                test: 'test creat test',
                documents: 'test creat documents',
                trainingProgramId: 1,
                imgLink: "/img/trainingProgram/training-icon-1.svg"

            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Course.destroy({
                    where: {
                        name: "test creat name course"
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1.1 : Post /admin/courses/addCourse with courseName is already existed ', function () {
        return it('Should return success==false', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                name: 'Our Customer Ericsson',
                description: 'test create name description',
                duration: '00:00:00',
                test: 'test create test',
                documents: 'test create documents',
                trainingProgramId:  1,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Post /admin/courses/updateCourse with update success', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Course.create({
                id: 55,
                name: 'Training Overview',
                description: 'test update name description',
                duration: '00:00:00',
                test: 'test update test',
                documents: 'test update documents',
                trainingProgramId: 1,
                imgLink: '/img/courses/training-icon-3.svg',
            });
            req.send({
                id: 55,
                name: 'Training Overview',
                description: 'test update name description',
                duration: '00:00:00',
                test: 'test update test',
                documents: 'test update documents',
                trainingProgramId: 1,
                imgLink: '/img/courses/training-icon-3.svg',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Course.update({
                    name: 'Tien',
                    description: 'moneyBui',
                    duration: '24:00:00',
                    test: 'abc',
                    documents: 'def',
                    trainingProgramId: 2,
                }, {
                        where: {
                            id: 55
                        }
                    });
                if (err) return done(err);
                done();
                models.Course.destroy({
                    where: {
                        id: 55
                    }
                });
            });
        });
    });

    describe('Test case 2.1 : Post /admin/courses/updateCourse with course not existed', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            // models.Course.create({
            //     id: 99,
            //     name: 'Banana',
            //     description: 'Brief overview for all training courses',
            //     duration: '00:00:00',
            //     test: 'test update test',
            //     documents: 'test update documents',
            //     trainingProgramId: 1,
            // });
            req.send({
                id: 99,
                name: 'Banana',
                description: 'Brief overview for all training courses',
                duration: '00:00:00',
                test: 'test update test',
                documents: 'test update documents',
                trainingProgramId: 1,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Post /admin/courses/deleteCourse', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                id: 36,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Course.create({
                    id: 36,
                    name: 'IMS Project Overview',
                    description: '- IMS teams',
                    duration: '02:00:00',
                    test: 'This is a test of IMS Project Overview course',
                    documents: 'This is a document of IMS Project Overview course',
                    trainingProgramId: 5,
                    imgLink: '/img/courses/training-icon-3.svg',
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3.1 : Post /admin/courses/deleteCourse', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                id: 4
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 5 : get Course Type List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getCourseTypeList');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6 : get Training Program List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getTrainingProgramList');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 7 : Post /admin/courses/addTrainingProgram Success', function () {
        return it('Should return success==true', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                name: 'test create name of new training program',
                description: 'test create name description',
                courseTypeId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                models.TrainingProgram.destroy({
                    where: {
                        name: "test create name of new training program"
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 7.1 : Post /admin/courses/addTrainingProgram fail becuz Name is already existed ', function () {
        return it('Should return success==false', function (done) {

            var req = request(DCC_Server).post('/admin/courses/addTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                name: 'Linux Programming',
                description: 'test creat name description',
                courseTypeId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 8 : Post /admin/courses/updateTrainingProgram', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.TrainingProgram.create({
                id: 14,
                name: 'testUpdateTP',
                description: 'test update name description',
                courseTypeId: 1,
            });
            req.send({
                id: 14,
                name: 'testUpdateTP',
                description: 'description of General Orientation trainning progra',
                courseTypeId: 5,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                  models.TrainingProgram.destroy({
                      where:{
                          id: 14
                      }
                  });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 8.1 : Post /admin/courses/updateTrainingProgram', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                id: 6,
                name: 'HOW I MET YOUR MOTHER',
                description: 'test update name description',
                courseTypeId: 5,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 9 : Post /admin/courses/deleteTrainingProgram', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.TrainingProgram.create({
                id: 8,
                name: 'Unit Test Training Program',
                description: 'Description of Unit test training_program',
                imgLink: '/img/courses/training-icon-3.svg',
                courseTypeId: 5
            });
            req.send({
                id: 8,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success,true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 9.1 : Post /admin/courses/deleteTrainingProgram | cannot delete TP with course existed', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                id: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success,false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 10 : Get Class List', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/getClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                courseId: 1,
            });
            req.end(function (err, res) {

                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 11.1 : Post /admin/courses/addClass Your class can not be added because of having a class in time frame at one location', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var date= new Date();
            req.send({
                courseId: 1,
                location: '3-A',
                trainer: {
                    id: 1
                },
                startTime: date
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 11.2 : Post /admin/courses/addClass not found course', function () {
        return it('Should return success == false', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var startDate = "Wed Mar 25 2050 07:00:00 GMT+0700 (SE Asia Standard Time)";
            var endDate = "Sat Mar 28 2050 07:00:00 GMT+0700 (SE Asia Standard Time)";
            var arrayTime = [];
            arrayTime.push({
                starttime: startDate,
                endtime: endDate
            });
            req.send({
                location: '4S',
                trainer: {
                    id: 1
                },
                arrayClassTime: arrayTime
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11.3 : Post /admin/courses/addClass add class success, SUNDAY', function () {
        return it('Should return success == true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.RequestOpening.create({
              userId:2,
              courseId: 4,
              requestType: "register"
            });
            var startDate = "2099 05 17 06:00:00";
            var endDate = "2099 05 17 07:00:00";
            var arrayTime = [];
            arrayTime.push({
                starttime: startDate,
                endtime: endDate
            });
            req.send({
                courseId: 4,
                location: '4S',
                trainer: {
                    id: 1
                },
                arrayClassTime: arrayTime
            }).end(function (err, res) {
                assert.equal(res.body.success, true);
                models.ClassRecord.destroy({
                    where:{
                        classId:res.body.idClass
                    }
                });
                models.sessionClassTime.destroy({
                    where:{
                        idClass:res.body.idClass
                    }
                });
                models.Class.destroy({
                    where:{
                        id:res.body.idClass
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11.4 : Post /admin/courses/addClass add class success, MONDAY', function () {
        return it('Should return success == true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.RequestOpening.create({
              userId:2,
              courseId: 4,
              requestType: "register"
            });
            var startDate = "2099 05 18 06:00:00";
            var endDate = "2099 05 18 07:00:00";
            var arrayTime = [];
            arrayTime.push({
                starttime: startDate,
                endtime: endDate
            });
            req.send({
                courseId: 4,
                location: '4S',
                trainer: {
                    id: 1
                },
                arrayClassTime: arrayTime
            }).end(function (err, res) {
                assert.equal(res.body.success, true);
                models.ClassRecord.destroy({
                    where:{
                        classId:res.body.idClass
                    }
                });
                models.sessionClassTime.destroy({
                    where:{
                        idClass:res.body.idClass
                    }
                });
                models.Class.destroy({
                    where:{
                        id:res.body.idClass
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11.5 : Post /admin/courses/addClass add class success, NORMALDAY', function () {
        return it('Should return success == true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/addClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.RequestOpening.create({
              userId:2,
              courseId: 4,
              requestType: "register"
            });
            var startDate = "2099 05 19 06:00:00";
            var endDate = "2099 05 19 07:00:00";
            var arrayTime = [];
            arrayTime.push({
                starttime: startDate,
                endtime: endDate
            });
            req.send({
                courseId: 4,
                location: '4S',
                trainer: {
                    id: 1
                },
                arrayClassTime: arrayTime
            }).end(function (err, res) {
                assert.equal(res.body.success, true);
                models.ClassRecord.destroy({
                    where:{
                        classId:res.body.idClass
                    }
                });
                models.sessionClassTime.destroy({
                    where:{
                        idClass:res.body.idClass
                    }
                });
                models.Class.destroy({
                    where:{
                        id:res.body.idClass
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 12 : Post /admin/courses/updateClass', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/updateClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var startDate = new Date("December 15,2019 11:00:00 ");
            var endDate = new Date("December 15,2019 12:00:00 ");
            var arrayTime = [];
            arrayTime.push({
                starttime: startDate,
                endtime: endDate
            })
            req.send({
                courseId: '4',
                location: '3L-Mercury',
                arrayClassTime: arrayTime,
                trainerId: 381,
                maxAttendant: '12',
                note: 'test crat note'
            });
            req.end(function (err, res) {
                // models.Class.destroy({
                //     where: { courseId: 4,
                //     location: '3L-Mercury' }
                // });
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 13.1 : Post /admin/courses/deleteClass', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var startDate = new Date("December 15,2019 11:00:00 ");
            var endDate = new Date("December 15,2019 12:00:00 ");
            models.Class.create({
                id: 3,
                location: '5-S',
                courseId: 3,
                trainerId: 1,
                startTime: startDate,
                endTime: endDate
            });
            models.sessionClassTime.create({
                starttime: startDate,
                endtime: endDate,
                idClass: 3
            });
            models.ClassRecord.create({
                status: 'Enrolled',
                classId: 3,
                traineeId:1
            });
            req.send({
                id: 3,
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 13.2 : Post /admin/courses/deleteClass', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/courses/deleteClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                id: 999999,
                startTime: Date.now()
            });

            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 14 : get /admin/courses/getAllTP', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getAllTP');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 15.1 : Edit Class fail if start time', function(){
        return it('Should return success==true', function(done){
            var req = request(DCC_Server).post('/admin/courses/editClass');
            req.cookies = Cookies;
            var endTime = new Date();
            var newAttend=[{
                id: 5,
                username:'Nam Nguyen',
                email:'nam@gmail.com'
              }];
            var specificAttend=[{
                id: 1,
                username:'Thanh Sanh',
                email:'thach@gmail.com'
              },{
                id: 5,
                username:'Nam Nguyen',
                email:'nam@gmail.com'
            }];
            var delAttend=[{
                id: 4,
                username:'Money',
                email:'moneybui@gmail.com'
            }];
            endTime.setDate(endTime.getDate()+1);
            models.Class.create({
                id: 100,
                location: '4F',
                courseId: 1,
                startTime: Date.now(),
                endTime: endTime,
                trainerId: 2
            });
            models.sessionClassTime.create({
                starttime: Date.now(),
                endtime: endTime,
                idClass:100
            });
            models.ClassRecord.create({
                status: 'Enrolled',
                classId: 100,
                traineeId: 4
            });
            models.RequestOpening.create({
              userId:5,
              courseId: 1,
              requestType: "register"
            });
            req.set('x-access-token', Token);
            req.send({
                startTime: '2020-11-19T02:35:30.000Z',
                endTime: '2020-11-19T03:35:30.000Z',
                classid: 100,
                location: '3-A',
                // username: 'Quan',
                courseId: '1',
                specificAttendant: specificAttend,
                newAttendant: newAttend,
                delAttendant: delAttend
                //id: '452',
                // specificAttendantlength: '4',
                // newAttendantlength: '2'
            }).end(function (err, res) {
                assert.equal(res.body.success, true);
                  models.sessionClassTime.destroy({
                      where:{
                        idClass: 100
                      }
                  });
                  models.ClassRecord.destroy({
                      where:{
                          classId: 100
                      }
                  });
                  models.Class.destroy({
                    where:{
                      id: 100
                    }
                  });
                if (err) return done(err);
                done();

            });
        })
    });
    describe('Test case 15.2 : Edit Class enter if start time, flgCheck = -1', function(){
        return it('Should return success==false', function(done){
            var req = request(DCC_Server).post('/admin/courses/editClass');
            req.set('x-access-token', Token);
            req.send({
                startTime: '2015-12-16T03:35:30.000Z',
                endTime: '2015-12-16T02:35:30.000Z',
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        })
    });

    describe('Test case 16 : get /admin/courses/getAllCourse', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
            .get('/admin/courses/getAllCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
     describe('Test case 17 : get /admin/courses/getAllTrainer', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/courses/getAllTrainer');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

});
