var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
var models = require('../../../server/models');
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
process.env.NODE_ENV = settings.testDatabase;
var DCC_Server = require('../../../app.js');

describe('<Unit test for Admin Setting>', function () {
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
    describe('Test case 1 : get number to set high demand', function () {
        return it('Should return success==3', function (done) {
            var req = request(DCC_Server).post('/common/setting/getValueByName');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({name:'numberHighDemand'});
            req.end(function (err, res) {
                assert.equal(res.body.data, 3);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2 : update number to set high demnd', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/common/setting/updateSettingByName');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({name:'numberHighDemand', value: 3});
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
});
