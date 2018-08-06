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
var models = require('../../../server/models');
var DCC_Server = require('../../../app.js');

describe('<Unit test for feedback function>', function () {
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
    describe('Test Case 1 : Create a null Feedback for Class that doesnt have feedback', function () {
        return it('It should return false', function (done) {
            var req = request(DCC_Server).post('/trainee/feedback/getMyFeedbackByClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json')
            req.send({
                    classId: 2,
                    traineeId: 1
                })
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2:get feedback from class already had feedback', function () {
        return it('It should return true', function (done) {
            var req = request(DCC_Server).post('/trainee/feedback/getMyFeedbackByClass');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json');
            models.ClassRecord.update({
                bestThing_comments: 'Already feedback',
                trainer_rating: 4,
                improve_comments: 'Good',
                content_rating: 3,
                happy_rating: 3
            }, {
                where: {
                    traineeId: 2,
                    classId: 4
                }
            })
            req.send({
                classId: 4,
                traineeId: 2,
            })
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    
    describe('Test case 2.1: update cofirm join', function () {
        return it('It should return true', function (done) {
            var req = request(DCC_Server).post('/common/classrecord/updateStatusConfirmJoin');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json');
            req.send({
                cofirm: 'YES',
                classId: 4,
                traineeId: 2,
            })
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2.2: update cofirm join', function () {
        return it('It should return true', function (done) {
            var req = request(DCC_Server).post('/common/classrecord/updateStatusConfirmJoin');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json');
            req.send({
                cofirm: null,
                classId: 4,
                traineeId: 2,
            })
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2.3: update cofirm join', function () {
        return it('It should return true', function (done) {
            var req = request(DCC_Server).post('/common/classrecord/updateStatusConfirmJoin');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.set('Accept', 'application/json');
            req.send({
                cofirm: 'YES',
                classId: 1,
                traineeId: 1,
            })
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3: Update Feedback', function () {
        return it('It should return true', function (done) {
            var req = request(DCC_Server).post('/trainee/feedback/sendFeedback');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req
                .set('Accept', 'application/json')
                .send({
                    classId: 4,
                    bestThing_comments: 'update feedback',
                    improve_comments: 'Great!',
                    traineeId: 2,
                    trainer_rating: 3,
                    content_rating: 4,
                    happy_rating: 3
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                })
        });
    });


});
