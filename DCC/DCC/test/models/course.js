var models = require('../../server/models');
var assert = require('assert');

describe('Test case 1: Course.getNameCoursebyCourseId', function () {
    it('should return true valid Course id', function (done) {
        models.Course.getNameCoursebyCourseId(5, function (rs) {
            var isValid = (rs === null) ? false : true;
            assert.equal(isValid, true);
            done();
        })
    });
});