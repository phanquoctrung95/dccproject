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

describe('<Unit test for common (Course detail)>', function () {
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
    describe('Test case 1 : Get Course Detail', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/course/getCourseDetail');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ courseId: 1 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2 : Get Class by CourseId', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/course/getClassByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ 
                courseId: 2,
                order: 'ASC' 
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 3: Get all courses', function(){
        return it('Should return success==true', function (done){
            var req = request(DCC_Server).post('/common/course/getAllCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 4: Get all Request Openning', function(){
        return it('Should return success==true', function(done){
            var req = request(DCC_Server).post('/common/course/getRequesterByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 5 : Get Class by CourseId With feedback', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/course/getClassByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ 
                courseId: 4,
                order: 'ASC' 
            });
            req.end(function (err, res) {
                assert.equal(res.body.success,true);
                /*assert.equal(res.body.countTrainerRating, 1);
                assert.equal(res.body.countHappyRating, 1);
                assert.equal(res.body.countFeedback,2);*/
                if (err) return done(err);
                done();
            });
        });
    });

    

    describe('Test case 5: Get Course Name By ClassId',function(){
        return it('Should return success = true',function(done){
            var req = request(DCC_Server).post('/common/course/getCourseNameByClassId');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ classID: 56 });
            req.end(function (err, res) {
            assert.equal(res.body.success,true);
            if (err) return done(err);
            done();
        });
    });
    });

    describe('Test case 6: get Course By ClassID',function(){
    return it('Should return success = true',function(done){
        var req = request(DCC_Server).post('/common/course/getCourseByClassID');
        req.cookies = Cookies;
        req.set('x-access-token', Token);
        req.send({ classID: 56 });
        req.end(function (err, res) {
        assert.equal(res.body.success,true);
        if (err) return done(err);
        done();
        });
    });
    });


    describe('Test case 8: get Course Of User Dont Feedback By ID',function(){
        return it('Should return success = true',function(done){
            var req = request(DCC_Server).post('/common/course/getCourseOfUserDontFeedbackByUserID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ userID: 465 });
            req.end(function (err, res) {
            assert.equal(res.body.success,true);
            if (err) return done(err);
            done();
        });
    });
    });
});