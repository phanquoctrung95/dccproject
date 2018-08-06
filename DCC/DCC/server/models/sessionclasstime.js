var _sessionClassTime = require('./DataObjects/Sessionclasstime');

module.exports = function(sequelize) {
    var sessionClassTime = sequelize.define('sessionClassTime', _sessionClassTime, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            // Insert class into table you want and you think I insert each other time 
            addSessionClassTime: function (idClass, arrayClassTime, cb) {
                for(var i = 0 ; i < arrayClassTime.length; i++){
                    arrayClassTime[i].idClass = idClass;
                }
                sessionClassTime.bulkCreate(arrayClassTime).then(cb);
            },
            deleteSessionTime: function (idClass, cb) {
                sessionClassTime.destroy({
                     where: { idClass: idClass } 
                }).then(cb(idClass))
            }
            ,
            editSessionTime: function (classId, startTime, endTime, cb) {
                sessionClassTime.update({
                    starttime: startTime,
                    endtime: endTime
                }, {
                    where: {
                        idClass: classId
                    }
                }).then(cb);
            }
        },
        tableName: 'Sessionclasstime',
        timestamps: false
    });
    return sessionClassTime;
};
