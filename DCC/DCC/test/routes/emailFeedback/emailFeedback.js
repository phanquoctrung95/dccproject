var request = require('supertest');
var assert = require('chai').assert;
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');


describe('<Unit test for emailFeedback (emailFeedback detail)>', function () {
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

    describe('Test case: Email Feedback', function () {
        return it('Course ID that users do not feedback', function (done) {
            var req = request(DCC_Server).get('/emailFeedback/emailFeedback/getAllInfoAboutUserDontFeedback');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case: Email Feedback', function () {
        return it('Course ID that users do not feedback', function (done) {
            var req = request(DCC_Server).get('/emailFeedback/emailFeedback/getAllInfoAboutUserIsSentEmailFeedbacMoreThreeDays');
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