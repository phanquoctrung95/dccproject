var _emailFeedbackModel = require("./DataObjects/emailFeedback");

module.exports = function (sequelize) {
    var emailFeedback = sequelize.define('emailFeedback', _emailFeedbackModel, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        classMethods: {
            // Info about user is email_user, user id, class_id don't feedback which is value's return
            getAllInfoAboutUserDontFeedback: function (cb) {
                sequelize.query('SELECT DISTINCT userOne.email, userOne.id as traineeId, classRecordOne.classId '
                             + ' FROM user AS userOne, class_record AS classRecordOne '
                             + ' WHERE classRecordOne.status = "Learned" AND classRecordOne.traineeId = userOne.id '
                                    + ' AND userOne.id NOT IN (SELECT userTwo.id '
                                                           + ' FROM user AS userTwo, class_record as classRecordTwo '
                                                           + ' WHERE classRecordTwo.status = "Learned" AND LENGTH(classRecordTwo.improve_comments) >= 0 '
                                                                 + ' AND classRecordTwo.traineeId = userTwo.id AND classRecordTwo.classId = classRecordOne.classId) '
                                                                 + ' AND (userOne.id, classRecordOne.classId) NOT IN (SELECT DISTINCT email_feedback.userID, email_feedback.class_id_not_feedback ' 
                                                                                                                  + ' FROM email_feedback) ', {
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            },
            // Get user is sent email feedback but don't feedback more than 3 days
            getAllInfoAboutUserIsSentEmailFeedbacMoreThreeDays: function (cb) {
                sequelize.query('SELECT DISTINCT email_feedback.email_user, email_feedback.userID, email_feedback.class_id_not_feedback '
                    + ' FROM email_feedback, class_record '
                    + ' WHERE DATEDIFF(NOW(),email_feedback.lastdate_sent_emailfeedback) >= 3 '
                    + ' AND email_feedback.userID not in (SELECT class_record.traineeId '
                    + ' FROM class_record '
                    + ' WHERE LENGTH(class_record.improve_comments) >= 0) ', {
                        type: sequelize.QueryTypes.SELECT
                    }).then(cb);
            }
        },
        tableName: 'email_feedback',
        timestamps: false
    });
    return emailFeedback;
};