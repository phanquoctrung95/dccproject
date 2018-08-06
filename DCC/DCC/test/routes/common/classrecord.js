var request = require('supertest');
var assert = require('chai').assert;
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
process.env.NODE_ENV = settings.testDatabase;
var DCC_Server = require('../../../app.js');


describe('<Unit test for common (Class record detail)>', function () {
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

    describe('Test case 1 : Get Class Record by ClassID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/classrecord/getClassRecordByClassID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ classID: 60 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2 : Get Class Record by courseTypeID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/classrecord/getClassRecordByCourseTypeID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ courseTypeID: 1 });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });    
});

