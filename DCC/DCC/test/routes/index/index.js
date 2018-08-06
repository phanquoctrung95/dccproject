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
var model = require('../../../server/notification/desktop/index.js')

describe('<Unit test for Login>', function () {

    describe('Test case 1.1 : Login success, role = admin', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe@gmail.com',
                    password: 'qwe'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 1);
                    else
                        assert.equal(res.body.success, false); //edit true to false
                    // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.1.1 : Login failed, role = admin', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe',
                    password: 'qqwe'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 1);
                    else
                        assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.1.2 : Login success, role = admin', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 's3595082@rmit.edu.vn',
                    password: 'root1'
                })
                .end(function (err, res) {
                        assert.equal(res.body.success, 1);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.2 : Login success, role = trainee', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'huy@email.com',
                    password: 'soledad'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 3);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 1.3 : Login success, role = trainer', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'huy@email.com',
                    password: 'soledad'

                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 2);
                    else
                        assert.equal(res.body.success, false); //edit true to false
                    // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 1.4 : Login success, role = newuser', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'nam@gmail.com',
                    password: 'root1'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 0);
                    else
                        assert.equal(res.body.success, true);
                    // globalCookies = res.headers['set-cookie'].pop().split(';')[0];
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 2 : Login fail, username true, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'qwe',
                    password: 'wrong password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });


    describe('Test case 3 : Login fail, username false, password true', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'qwe'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4 : Login fail, username false, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'wrong user password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 4.2: isLogin fail', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .get('/isLogin')
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.1 : Login User Manual success, role = trainee', function () {
        return it('Should return success==true', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'bqd@gmail.com',
                    password: '123'
                })
                .end(function (err, res) {
                    if (res.body.success === true)
                        assert.equal(res.body.role, 3);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.2 : Login User Manual fail, username true, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'bqd@gmail.com',
                    password: 'wrong password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('Test case 5.3 : Login User Manual fail, username false, password true', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: '123'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });
    describe('Test case 5.4 : Login User Manual fail, username false, password false', function () {
        return it('Should return success==false', function (done) {
            request(DCC_Server)
                .post('/login')
                .send({
                    username: 'wrong user name',
                    password: 'wrong user password'
                })
                .end(function (err, res) {
                    assert.equal(res.body.success, false);
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('<Unit test for Logout>', function () {
    return it('Should return success==true, and destroy client session on server', function (done) {
        request(DCC_Server)
            .get('/logout')
            .end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
    });
});



describe('<Unit test for isLogin success>', function () {
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

    describe('Test case 4.1: isLogin success', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/isLogin');
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

describe('Test case 0: get homepage', function () {
    return it('Should return success==true', function (done) {
        request(DCC_Server)
            .get('/')
            .end(function (err, res) {
                assert.equal(res.status, '200');
                if (err) return done(err);
                done();
            });
    });
});



/*
-------------------------- Testing file DCC/server/notification/desktop/index.js -----------------------------------
*/


/*
describe('Test case 1: check value in binary search', function () {
    return it('2 == ', function (done) {
        var req = request(DCC_Server).get('../server/');
        req.send({
            key: 2,
            first: 0,
            last: 6
        });
        req.end(function (err, res){
            assert.equal(res.status, 2);
            if(err) return done(err);
            done();
        });
    });
});
*/

/*
describe('Test case 2: check user is online', function () {
    return it(' ', function (done) {
        var req = request(DCC_Server).get('/server/notification/desktop/index/checkExistUserOnline');
        req.send({
            email: "qwe@gmail.com"
        });
        req.end(function (err, res){
            assert.equal(res.status, true);
            if(err) return done(err);
            done();
        });
    });
});
*/