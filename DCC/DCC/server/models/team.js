var _teamModel = require("./DataObjects/team");

module.exports = function (sequelize) {
    var teamModel = sequelize.define('teamModel', _teamModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            // Add method here
            getTeamName: function (cb) {
                teamModel.findAll().then(cb);
            },
        },
        tableName: 'team',
        timestamps: false
    });
    return teamModel;
};