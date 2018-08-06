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



describe('<Unit test for trainee-courseRegister>', function () {
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

    describe('Test case 1 : Get training programs', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getTrainingProgram');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 2 : Get Opening Class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/trainee/courseRegister/getOpeningClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : Get Request Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/getByUserID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
                .send({ userId: 2 })
                .end(function (err, res) {

                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4 : Send Register Request: Request is existed', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
                .send({ userId: 2, courseId: 5 })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Test case 5 : Send Register Request: Request is not existed, request-type is join (class is not opening)', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Class.create({
                location: "4S-Mercedes",
                courseId: 5,
                startTime: Date.now() - 1
            })
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 5})
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.RequestOpening.destroy({ where: { userId: 1, courseId: 5 } });
                    models.Class.destroy({
                        where: {
                            courseId: 5
                        }
                    });
                    if (err) return done(err);
                    done();
                });
        });
    });

    // describe('Test case 6 : Send Register Request: Request is already existed, request-type is register (class is not opening)', function () {
    //     return it('Should return success==false', function (done) {
    //         var req = request(DCC_Server)
    //             .post('/trainee/courseRegister/sendRegisterRequest');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         models.RequestOpening.create({
    //             userId: 3,
    //             courseId: 2,
    //             requestType: "register"
    //         })
    //         req.set('Accept', 'application/json')
    //             .send({ userId: 3, courseId: 2 })
    //             .end(function (err, res) {
    //                 assert.equal(res.body.success, false);
    //                 models.RequestOpening.destroy({
    //                     where: {
    //                         userId: 3,
    //                         courseId: 2
    //                     }
    //                 });
    //                 if (err) return done(err);
    //                 done();
    //             });
    //
    //     });
    // });

    // describe('Test case 6.1 : Send Register Request: class is opening, already enroll', function () {
    //     return it('Should return success==false ', function (done) {
    //         var req = request(DCC_Server)
    //             .post('/trainee/courseRegister/sendRegisterRequest');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.set('Accept', 'application/json')
    //             .send({ userId: 3, courseId: 2 })
    //             .end(function (err, res) {
    //                 assert.equal(res.body.success, false);
    //                 if (err) return done(err);
    //                 done();
    //             });
    //     });
    // });

    describe('Test case 6.2 : Send Register Request: class is opening, enroll success', function () {
        return it('Should return success==true ', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/sendRegisterRequest');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
                .send({ userId: 1, courseId: 4 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.RequestOpening.destroy({
                        where: {
                            userId: 1,
                            courseId: 4
                        }
                    });
                    models.ClassRecord.destroy({
                        where: {
                            traineeId: 1,
                            classId: 4
                        }
                    });
                    if (err) return done(err);
                    done();
                });
        });
    });
    // describe('Test case 6.3 : Send Register Request: class is opening, have not enrolled', function () {
    //     return it('Should return success==true ', function (done) {
    //         var req = request(DCC_Server)
    //             .post('/trainee/courseRegister/sendRegisterRequest');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.set('Accept', 'application/json')
    //             .send({ userId: 1, courseId: 4 })
    //             .end(function (err, res) {
    //                 assert.equal(res.body.success, true);
    //                 models.RequestOpening.destroy({
    //                     where: {
    //                         userId: 1,
    //                         courseId: 4
    //                     }
    //                 }); // FIX TEST
    //                 // models.ClassRecord.destroy({
    //                 //     where: {
    //                 //         classId: 1269,
    //                 //         traineeId: 3
    //                 //     }
    //                 // });
    //                 if (err) return done(err);
    //                 done();
    //             });
    //     });
    // });


    // describe('Test case 7 : Send Register Request: Request enroll fail, user aleardy enrolled (class is not opening)', function () {
    //     return it('Should return success==false', function (done) {
    //         var req = request(DCC_Server)
    //             .post('/trainee/courseRegister/sendRegisterRequest');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.set('Accept', 'application/json');
    //         req.send({ userId: 1, courseId: 2 });
    //         req.end(function (err, res) {
    //                 assert.equal(res.body.success, false);
    //                 if (err) return done(err);
    //                 done();
    //             });
    //     });
    // });

    describe('Test case 8 : Delete Request Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/deleteRequestOpening');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
            models.RequestOpening.create({
                userId: 6,
                courseId:2
            });
            req.send({ userId: 6, courseId: 2 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 9 : Un-enroll Course', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/unEnrollCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
                .send({ traineeId: 465, classId: 3 })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    models.ClassRecord.create({ classId: 3, traineeId: 2, status: 'Enrolled', id: 3 });
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 10 : Get my enroll class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/getMyEnrolledClass');
            req.send({ email: "thach@gmail.com" });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11 : update ClassRecord status from Enrolled to Learned', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server)
                .post('/trainee/courseRegister/updateClassRecordStatus');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
            req.send({
                classId: 3,
                traineeId: 465
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 12: get Course by Name /trainee/courseRegister/getCoursebyName', function () {
        return it('Should return id==1', function (done) {
            var req = request(DCC_Server).post('/trainee/courseRegister/getCoursebyName');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                name: 'STP Handling - Blade Cluster (Practice)'
            })
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    try {
                        assert.equal(res.body.course.id, 7); //has id = 7
                    } catch (error) {
                        return done(error);
                    }
                    done();
                });

        });
    });
    describe('Test case 13: Get Trainee By Class Id', function () {
        return it('Should return id==1', function (done) {
            var req = request(DCC_Server).post('/trainee/courseRegister/getTraineeByClassId');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                classId: 1108
            })
            req.end(function (err, res) {
                assert.equal(res.body.success, true)
                if (err) return done(err)
                done()
            })

        });
    });
});
