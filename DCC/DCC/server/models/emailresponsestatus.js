var _emailResponseStatusModel = require("./DataObjects/emailResponseStatus");

module.exports = function (sequelize) {
    var emailResponseStatus = sequelize.define('EmailResponseStatus', _emailResponseStatusModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            // updateStatus: function(email, hash, status, callback) {
            //     emailResponseStatus
            //         .findOne({ where: {email: email, hash: hash} })
            //         .then((emailresponsestatus) => {
            //             // Check if record exists in db
            //             if(emailresponsestatus) {
            //                 emailresponsestatus.update({
            //                     status: status
            //                 })
            //                 .then(callback);
            //             }
            //         });
            // },
            add: function(email, hash, status, callback) {
                emailResponseStatus.create({
                    email: email,
                    hash: hash,
                    status: status
                }).then(callback);
            }
        },
        tableName: 'email_response_status',
        timestamps: false
    });
    return emailResponseStatus;
}