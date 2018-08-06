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


describe('<UNIT TEST FOR ENVIROMENT>', function () {
    //var Cookies;
    var Token;
    var Token2='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjEzNDBsZWdpYUBnbWFpbC5jb20iLCJpYXQiOjE1MTQ0MzA3NjgsImV4cCI6MTUxNDUxNzE2OH0.rclEiRNokZVnXSRWBlsbXjuSuITp8UYITauloC-8EIj';
    beforeEach(function (done) {
        request(DCC_Server)
            .post('/login')
            .set('Accept', 'application/json')
            .send({
                username: 'qwe@gmail.com',
                password: 'qwe'
            })
            .end(function (err, res) {
                //Cookies = res.headers['set-cookie'].pop().split(';')[0];
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
    describe('Test case 1 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie',['email=qwe@gmail.com']);
            req.send(
                {
                    email: "qwe@gmail.com"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, 1);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1.2 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==false because of not matched token', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie',['email=1340legia@gmail.com']);
            req.send(
                {
                    email: "1340legia@gmail.com"
                }
            );
            req.set('x-access-token', Token2);
            req.end(function (err, res) {
                assert.equal(res.body.success, 0);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1.3 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==false because no token provided', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie',['email=qwe@gmail.com']);
            req.send(
                {
                    email: "qwe@gmail.com"
                }
            );
            req.end(function (err, res) {
                assert.equal(res.status, '403');
                if (err) return done(err);
                done();
            });
        });
    });
 });
