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

describe('<Unit test for admin-dashboard>', function () {
    var Cookies;
    var Token;
    beforeEach(function (done) {
        request(DCC_Server)

            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'qwe@gmail.com', //admin account!!!
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

    describe('Test case 1 : Get request open course for admin', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/admin/dashboard/getAdminRequestOpenCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2.1 : Get info request open course from notification, get success', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/admin/dashboard/getInfoRequestCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({courseId:2});
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2.2 : Get info request open course from notification, get fail', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/admin/dashboard/getInfoRequestCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({courseId:3});
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
});
