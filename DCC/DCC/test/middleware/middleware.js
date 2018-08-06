var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../settings.js');
else
    settings = require('../../settingsDefault.js');
process.env.NODE_ENV = settings.testDatabase;
var DCC_Server = require('../../app.js');
var models = require('../../server/models');
//var authMiddleware = require('../server/middleware/authMiddleware.js');

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


    // describe('Test case 1 : check Login success', function () {
    //     return it('Should return success==true', function (done) {

            
    //         var req = request(DCC_Server).post('/server/middleware/authMiddleware/ensureAuthenticated');
    //         req.cookies = Cookies;
    //         req.set('x-access-token', Token);
    //         req.send({

    //         });
    //         req.end(function (err, res) {
    //             assert.equal(res.body.success, true);
    //             if (err) return done(err);
    //             done();
    //         });
    //     });
    // });
});