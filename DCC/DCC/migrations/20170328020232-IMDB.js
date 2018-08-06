'use strict';

var models = require('../server/models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(models.User.tableName, models.User.attributes)
      .then(function () { return queryInterface.createTable(models.Course.tableName, models.Course.attributes) })
      .then(function () { return queryInterface.createTable(models.CourseType.tableName, models.CourseType.attributes) })
      .then(function () { return queryInterface.createTable(models.TrainingProgram.tableName, models.TrainingProgram.attributes) })
      .then(function () { return queryInterface.createTable(models.RequestOpening.tableName, models.RequestOpening.attributes) })
      .then(function () { return queryInterface.createTable(models.Class.tableName, models.Class.attributes) })
      .then(function () { return queryInterface.createTable(models.ClassRecord.tableName, models.ClassRecord.attributes) })
      .then(function () { return queryInterface.createTable(models.Notifications.tableName, models.Notifications.attributes) })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
