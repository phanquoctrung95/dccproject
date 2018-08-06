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


describe('<Unit test for view schedule function>', function () {
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
    describe('Test case 1: getEnrolledCourseList', function () {
        return it('It should return true ', function (done) {
            var req = request(DCC_Server).post('/trainee/viewSchedule/getEnrolledCourseList');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req
                .set('Accept', 'application/json')
                .send({
                    userId:2
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 2: Get Other Enrolled Course List', function () {
        return it('It should return true ', function (done) {
            var req = request(DCC_Server).post('/trainee/viewSchedule/getOtherEnrolledCourseList');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req
                .set('Accept', 'application/json')
                .send({
                    userId:1
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 3: Get All Enrolled Course List', function () {
        return it('It should return true ', function (done) {
            var req = request(DCC_Server).get('/trainee/viewSchedule/getAllEnrolledCourseList');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    assert.equal(res.body.success, true);
                    if (err) return done(err);
                    done();
                });
        });
    });
});
