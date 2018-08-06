var request = require('supertest');
var assert = require('chai').assert;
var expect = require('chai').expect;
var md5 = require('md5');
var fs = require('fs');
var path = require('path');
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');
process.env.NODE_ENV = settings.testDatabase;
var DCC_Server = require('../../../app.js');
var models = require('../../../server/models');

var copyFile = (file, dir2) => {

    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir2, f));

    source.pipe(dest);
    source.on('end', function () { console.log('Succesfully copied'); });
    source.on('error', function (err) { console.log(err); });
};


describe('<Unit test for user profile>', function () {
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

    describe('Test case 0 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==false because cookie email does not match', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=khicon_conkhi0906@yahoo.com']);
            req.send(
                {
                    email: 'qwe@gmail.com'
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.status, '403');
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.0 : Get /user/userProfile/getUserInfo', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    email: 'qwe@gmail.com'
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.1 : Get user/userProfile/getUserById', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserById').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    id: "461"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.2 : Get user/userProfile/getAllTrainer', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getAllTrainer').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.3 : Get user/userProfile/getAllUserByCourseID', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getAllUserByCourseID').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    courseID: "4"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.4 : Get user/userProfile/getUserDontFeedback', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getUserDontFeedback').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.5: Get user/userProfile/getUserMaxRatingTrainer', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getUserMaxRatingTrainer').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.6: Get user/userProfile/getUserMaxRatingContents', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getUserMaxRatingContents').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.7: Get user/userProfile/getUserMaxRatingHappy', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getUserMaxRatingHappy').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 0.9: Get user/userProfile/getUserHaveImproveComment', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserHaveImproveComment').set('Cookie', ['email=qwe@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case: get user dont feedback by courseID', function () {
        return it('getUserDontFeedbackByCourseID', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserDontFeedbackByCourseID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({
                courseID: 278
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1 : Get /user/userProfile/getUserInfo for currentRole = 1', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    email: "qwe@gmail.com"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.role, 1);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.1 : Get /user/userProfile/getUserInfo for currentRole = 2 ', function () {
        return it('Should return role == 2', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    email: "thong@gmail.com"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.role, 2);
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 1.2 : Get /user/userProfile/getUserInfo for currentRole = 3 ', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    email: "s3595082@rmit.edu.vn"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.role, 3);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 1.3 : Get /user/userProfile/getUserInfo for currentRole = 0 ', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserInfo').set('Cookie', ['email=qwe@gmail.com']);
            req.send(
                {
                    email: "nam@gmail.com"
                }
            );
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.role, 0);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 2 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'moneybui@gmail.com',
                username: 'Thao test',
                status: 'test status',
                avatar: '/img/profiles/defaultProfile.jpg',
                dob: '01/01/2001',
                phone: '0000 000 000',
                password: null
            });

            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, 1);
                models.User.update({
                    username: 'Your name',
                    status: 'activated',
                    avatar: '/img/profiles/userPhoto-1488194296868test.jpg',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    password: null
                }, {
                        where: { email: 'moneybui@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });


    describe('Test case 8 : Post /user/userProfile/photo', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/photo').attach('image', './test/routes/user/test.jpg');
            req.set('Cookie', ['email=nam@gmail.com']);
            req.set('email', ['nam@gmail.com']);
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                // remove file after test upload
                fs.unlink('./client' + res.body.link);
                copyFile('./test/routes/user/userPhoto-1488169863745developer-icon.jpg', './client/img/profiles/');
                models.User.update({
                    avatar: '/img/profiles/userPhoto-1488169863745developer-icon.jpg'
                }, {
                        where: {
                            email: 'nam@gmail.com'
                        }
                    });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4.1 : post /user/userProfile/addUser', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/addUser');
            req.send({
                email: 'namnguyen@gmail.com',
                username: 'namnguyen',
                password: '123456',
                userType: 'Intern'
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                try {
                    assert.equal(res.body.success, true);
                    models.User.destroy({
                        where: {
                            email: 'namnguyen@gmail.com'
                        }
                    });
                } catch (err) {
                    return done(err);
                }
                done();
            });
        });
    });
    describe('Test case 4.2 : create user false post /user/userProfile/addUser', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/addUser');
            req.send({
                email: 'moneybui@gmail.com',
                password: '123',
                courseId: 'DCC'
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });
    //Test change password for user from Ldap server
    describe('Test case 5 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'moneybui@gmail.com',
                username: 'Changed name',
                status: 'Changed status',
                avatar: '/img/profiles/defaultProfile.jpg',
                dob: '01/01/2001',
                phone: '0000 000 000',
                password: null,
                isNotificationEmail: 0


            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, 1);
                models.User.update({
                    username: 'Your Name',
                    status: 'activated',
                    avatar: '/img/profiles/defaultProfile.jpg',
                    dob: '01/01/2001',
                    phone: '0000 000 000',
                    password: null
                }, {
                        where: { email: 'moneybui@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 6: get all users by admin /user/userProfile/getAllUsers', function () {
        return it('Should return sucess==true', function (done) {
            var req = request(DCC_Server).get('/user/userProfile/getAllUsers');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    //Test edit user profile with vietnamese names
    describe('Test case 7 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'moneybui@gmail.com',
                username: 'Your Name',
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.User.update({
                    username: 'money'
                },
                    {
                        where: { email: 'moneybui@gmail.com' }
                    });
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 8: get all users dont learn by Group ID /user/userProfile/getAllUserDontLearnByGroupID', function () {
        return it('Should return sucess==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getAllUserDontLearnByGroupID');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var arr = [];
            arr.push(123);
            arr = JSON.stringify(arr);
            var arr = "(" + arr.slice(1, -1) + ")";
            req.send({ groupID: arr });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    describe('Test case 9: get all users by email /user/userProfile/getUserIDByUserEmail', function () {
        return it('Should return sucess==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/getUserIDByUserEmail');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.send({ userEmail: 'qwe@gmail.com' });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });


});

describe('<Unit test for manual added user profile>', function () {
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
    //test update password
    describe('Test case 1 : post /user/userProfile/updateUserProfile', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/updateUserProfile');
            req.send({
                email: 'moneybui@gmail.com',
                username: 'Money',
                status: 'activated',
                avatar: '/img/profiles/defaultProfile.jpg',
                dob: '31/08/1995',
                phone: '0123456789',
                isNotificationDesktop: 1,
                isNotificationEmail: 0,
                isAdmin: 1,
                isTrainer: 1,
                isTrainee: 1
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    //test checkPassword, case : password correct
    describe('Test case 2 : post /user/userProfile/checkPassword', function () {
        return it('Should return success==true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/checkPassword');
            req.set('x-access-token', Token);
            req.send({
                email: 's3595082@rmit.edu.vn',
                password: "root1"
            });

            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });

    //test checkPassword, case : password incorrect
    describe('Test case 3 : post /user/userProfile/checkPassword', function () {
        return it('Should return success==false', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/checkPassword');
            req.send({
                email: 's3595082@rmit.edu.vn',
                password: '1234'
            });
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, false);
                if (err) return done(err);
                done();
            });
        });
    });

    // test changePasswordMd5, case: correct password
    describe('Test case 4: post /user/userProfile/changePasswordMd5', function () {
        return it('Should return success = true', function (done) {
            var req = request(DCC_Server).post('/user/userProfile/changePasswordMd5');
            req.send({
                email: "qwe@gmail.com  ",
                password: "qwe"
            });

            req.cookies = Cookies;
            req.set('x-access-token', Token);
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                if (err) return done(err);
                done();
            });
        });
    });
    // describe('Test case 5: post /models/class/getUserInClass', function () {
    //     return it('Should return success = true', function () {
    //         var req = models.Class.getUserInClass(16, 1);
    //     });
    // });



});
