var _SettingModel = require("./DataObjects/Setting");

module.exports = function (sequelize) {
    var Setting = sequelize.define('Setting', _SettingModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            getSettingByName: function (name, cb) {
                var query = {
                    where: {
                        name: name
                    }
                }
                Setting.findOne(query).then(cb);
            },
            updateSettingByName: function(name, value, cb){
                Setting.update({
                    value: value
                },{
                    where:{
                        name: name
                    }
                }).then(cb);
            }
        },
        tableName: 'setting',
        timestamps: false
    });
    return Setting;
};
