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
var models = require('../../../server/models');

describe('<Unit test for notification>', function () {
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

    after(function (done) {
        // Cleanup

        //logout
        request(DCC_Server).get('/logout');
        done();
    });

    describe('Test case 1: POST /notification/notification/getNotifications', function () {
        return it('Should return length == 5', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNotifications');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            //create 5 notifications for each test
            models.Notifications.create({
                id: 1,
                email: 'thong@gmail.com',
                userId: 6,
                status: 1
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 1
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 2
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 3
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 4
            });
            req.send({
                userId: 6
            });
            req.end(function (err, res) {
                assert.equal(res.body.data.length, 5);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 2: POST /notification/notification/getNumberofNewNotification', function () {
        return it('Should return == 2', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNumberofNewNotification');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 1
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 2
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 3
            });
            req.send({
                userId: 6,
            });
            req.end(function (err, res) {
                assert.equal(res.body.data, 2);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 3 : POST /notification/notification/updateNotificationStatus', function () {
        return it('Should return success == true', function (done) {
            var req = request(DCC_Server).post('/notification/notification/updateNotificationStatus');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Notifications.create({
                id: 1,
                email: 'thong@gmail.com',
                userId: 6,
                status: 1
            });
            req.send({
                id: 1,
                userId: 6
            });
            req.end(function (err, res) {
                assert.equal(res.body.success, true);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 4 : POST /notification/notification/getAllNewNotificationAndUpdateStatus', function () {
        return it('Should return notifications == 3', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getAllNewNotificationsAndUpdateStatus');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Notifications.create({
                id: 1,
                email: 'thong@gmail.com',
                userId: 6,
                status: 1
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 1
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 2
            });
            req.send({
                userId: 6
            });
            req.end(function (err, res) {
                assert.equal(res.body.data.length, 3);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });

        });
    });

    describe('Test case 5: POST /notification/notification/getNotificationsRequestCourse', function () {
        return it('Should return == 2', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNotificationsRequestCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 2
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 3
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 4
            });
            req.send({
                userId: 6
            });
            req.end(function (err, res) {
                assert.equal(res.body.data.length, 2);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 6: POST /notification/notification/getNumberofNewNotificationRequestCourse', function () {
        return it('Should return == 1', function (done) {
            var req = request(DCC_Server).post('/notification/notification/getNumberofNewNotificationRequestCourse');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 3
            });
            models.Notifications.create({
                userId: 6,
                email: 'thong@gmail.com',
                status: 4
            });
            req.send({
                userId: 6,
            });
            req.end(function (err, res) {
                assert.equal(res.body.data, 1);
                models.Notifications.destroy({
                    where: {
                        userId: 6
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 7: POST /notification/notification/addNotification just add new notification', function () {
        return it('Should result === 1', function (done) {
            var req = request(DCC_Server).post('/notification/notification/addNotification');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            req.send({
                userId: 5,
                email: 'long@gmail.com',
                title: 'BBC',
                content: 'You have 12 feedback',
                time: dateTime,
                status: 1,
                reference: 'trainee_dashboard', // need to link of feedback
            });
            req.end(function (err, res) {
                assert.equal(res.body.result, 1);
                models.Notifications.destroy({
                    where: {
                        userId: 5,
                        email: 'long@gmail.com',
                        title: 'BBC'
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 8: POST /notification/notification/addNotification dont add notification', function () {
        return it('Should result === 0', function (done) {
            var req = request(DCC_Server).post('/notification/notification/addNotification');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var userId = 5;
            var email = 'long@gmail.com';
            var title = 'BBC';
            var content = 'You have 12 feedback';
            var reference = 'trainee_dashboard'; // need to link of feedback
            models.Notifications.create({
                userId: userId,
                email: email,
                title: title,
                content: content,
                reference: reference, // need to link of feedback
            });
            req.send({
                userId: userId,
                email: email,
                title: title,
                content: content,
                time: dateTime,
                status: 1,
                reference: reference, // need to link of feedback
            });
            req.end(function (err, res) {
                assert.equal(res.body.result, 0);
                models.Notifications.destroy({
                    where: {
                        userId: 5,
                        email: 'long@gmail.com',
                        title: 'BBC'
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });

    describe('Test case 8: POST /notification/notification/addNotification dont add notification', function () {
        return it('Should result === 1', function (done) {
            var req = request(DCC_Server).post('/notification/notification/addNotification');
            req.cookies = Cookies;
            req.set('x-access-token', Token);
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var userId = 5;
            var email = 'long@gmail.com';
            var title = 'BBC';
            var content = 'You have 12 feedback';
            var reference = 'trainee_dashboard'; // need to link of feedback
            models.Notifications.create({
                userId: userId,
                email: email,
                title: title,
                content: content,
                reference: reference, // need to link of feedback
            });
            req.send({
                userId: userId,
                email: email,
                title: title,
                content: 'You have 10 feedback',
                time: dateTime,
                status: 1,
                reference: reference, // need to link of feedback
            });
            req.end(function (err, res) {
                assert.equal(res.body.result, 1);
                models.Notifications.destroy({
                    where: {
                        userId: 5,
                        email: 'long@gmail.com',
                        title: 'BBC'
                    }
                });
                if (err) return done(err);
                done();
            });
        });
    });
});
