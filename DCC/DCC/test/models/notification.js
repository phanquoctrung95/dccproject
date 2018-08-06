var models = require('../../server/models');
var assert = require('assert');

describe('Test case 1: notification.getAllNewNotificationsByEmail', function () {
    it('should return true valid notification id', function (done) {
        models.Notifications.getAllNewNotificationsByEmail('qwe@gmail.com', function (rs) {
            var isValid = (rs === null) ? false : true;
            assert.equal(isValid, true);
            done();
        })
    });
});

describe('Test case 2: notification.getNotificationbyIdnUserId', function () {
    it('should return true valid notification', function (done) {
        models.Notifications.getNotificationbyIdnUserId({ id: 30, userId: 465 }, rs => {
            var isValid = (rs === null) ? false : true;
            assert.equal(isValid, true);
            done();
        })
    });
});
