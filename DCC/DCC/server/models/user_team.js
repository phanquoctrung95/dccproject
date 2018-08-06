var _user_teamModel = require("./DataObjects/user_team");

module.exports = function (sequelize) {
    var user_teamModel = sequelize.define('user_teamModel', _user_teamModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            add: function (argumentUserID, argumentTeamID, cb) {
                user_teamModel.create({
                    userID: argumentUserID,
                    teamID: argumentTeamID,
                }).then(cb);
            }
        },
        tableName: 'user_team',
        timestamps: false
    });
    return user_teamModel;
};