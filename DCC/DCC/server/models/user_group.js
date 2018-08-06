var _user_groupModel = require("./DataObjects/user_group");

module.exports = function (sequelize) {
    var user_groupModel = sequelize.define('user_groupModel', _user_groupModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            add: function (argumentUserID, argumentgroupID, cb) {
                user_groupModel.create({
                    userID: argumentUserID,
                    groupID: argumentgroupID,
                }).then(cb);
            }
        },
        tableName: 'user_group',
        timestamps: false
    });
    return user_groupModel;
};