var _groupModel = require("./DataObjects/group");

module.exports = function (sequelize) {
    var groupModel = sequelize.define('groupModel', _groupModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            // Add method here
            getgroupName: function (cb) {
                groupModel.findAll().then(cb);
            },
        },
        tableName: 'group',
        timestamps: false
    });
    return groupModel;
};