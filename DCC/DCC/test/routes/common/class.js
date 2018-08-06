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
var SequelizeDatatypes = require('sequelize');
describe('<Unit test for common (Class detail)>', function () {
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
    describe('Test case 1 : Get Class All Detail', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getAllClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2 : Get Class by ClassId', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getClassById');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ id: 1 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    
    describe('Test case 3 : get Opening Class By CourseID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getOpeningClassByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ courseId: 278 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4 : get All Open and Incom Class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getAllOpenandIncomClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 5 :get User In Class', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getUserInClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ classId: 56 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6 :get Opening Class By ID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getOpeningClassByID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ classId: 56 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    // describe('Test case 7 :delete Class By ID', function () {
    //     return it('Should return success==true', function (done) {
    //         var req = request(DCC_Server).post('/common/class/deleteClassByID');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.send({ classId: 56 });
    //         req.end(function (err, res) {
    //             assert.equal(res.body.success, true);
    //             if (err) return done(err);
    //             done();
    //         });
    //     });
    // });

    describe('Test case 8 :get Content Email Feed Back By ClassID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getContentEmailFeedBackByClassID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ classID: 56 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 9 :get Class By Course ID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getClassByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ courseID: 4 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 10 :get Class By Course ID by Year', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getClassByCourseIDbyYear');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ 
                courseId: 4,
             });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 11 :get Class By Course ID by Month', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getClassByCourseIDbyMonth');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ 
                courseId: 4,
             });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 12 :get Class By Course ID by Week', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/class/getClassByCourseIDbyWeek');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ 
                courseId: 4,
             });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
});
