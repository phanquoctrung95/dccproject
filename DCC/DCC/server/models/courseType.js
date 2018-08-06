var _courseTypeModel = require('./DataObjects/courseType');

var log = require('../config/config')["log"];
var models = require("./index");

module.exports = function(sequelize) {
    var courseType = sequelize.define('CourseType', _courseTypeModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getAll: function (cb) {
                courseType.findAll().then(cb);
            }
        },

        tableName: 'course_type',
        timestamps: false
    });
    return courseType;
};
