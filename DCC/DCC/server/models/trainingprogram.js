var log = require('../config/config')["log"];
var _trainingprogramModel = require('./DataObjects/trainingProgram');
var Sequelize = require('sequelize');

module.exports = function (sequelize) {
    var Trainingprogram = sequelize.define('TrainingProgram', _trainingprogramModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getTrainingByName: function (TPname, cb) {
                var query = {
                    where: {
                        name: TPname
                    }
                };
                Trainingprogram.findOne(query).then(cb);
            },
            getTrainingByID: function (id, cb) {
                var query = {
                    where: {
                        name: id
                    }
                };
                Trainingprogram.findOne(query).then(cb);
            },
            getAll: function (cb) {
                Trainingprogram.findAll().then(cb);
            },
            getNestedTPBy: function (query, cb) {
                Trainingprogram.findAll(query).then(cb);
            }
            ,
            deleteTrainingProgramByID: function (id, cb) {
                Trainingprogram.destroy({ where: { id: id } }).then(cb);
            },
            add: function (name, description, courseTypeID, cb) {
                Trainingprogram.create({
                    name: name,
                    description: description,
                    courseTypeId: courseTypeID,
                    imgLink: '/img/trainingProgram/training-icon-1.svg'
                }).then(cb);
            },
            edit: function (id, name, description, courseTypeID, cb) {
                Trainingprogram.update({
                    name: name,
                    description: description,
                    courseTypeId: courseTypeID
                }, {
                        where: {
                            id: id
                        }
                    }
                ).then(cb);
            }
        },
        tableName: 'training_program',
        timestamps: false
    });
    return Trainingprogram;
};
