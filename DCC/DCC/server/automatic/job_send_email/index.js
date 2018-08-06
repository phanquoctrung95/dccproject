var schedule = require('node-schedule');
var sendEmail = require('../../notification/email');
var models = require('../../models');
var Jobs;
var os = require('os');
var fs = require('fs');
var CronJob = require('cron').CronJob;
var settings;
if (fs.existsSync('settings.js') == true)
    settings = require('../../../settings.js');
else
    settings = require('../../../settingsDefault.js');

var sendNewNotificationToEmail = function (email, EmailPeriod) {
    models.Notifications.getAllNewNotificationsByEmail(email, notifications => {
        if (notifications.length > 0) {
            models.Notifications.update({
                status: 0
            }, {
                    where: {
                        email: email,
                        status: {
                            $ne: 0
                        },
                    }
                });
            var noti = {
                subject: '[DEK] In this ' + EmailPeriod + 'new notifications ',
                content: '[DEK] In this ' + EmailPeriod + 'new notifications ' + os.EOL
            }
            for (var i = 0; i < notifications.length; i++) {
                noti.content += (i + 1) + '. ' + notifications[i].title + ' : ' + notifications[i].content + os.EOL;
            }
            noti.content += 'Regards,';
            sendEmail([email], noti.subject, noti.content);
        }
    });
}
var sortJobByEmail = function () {
    Jobs.sort(function (prev, next) {
        var upper_prev = prev.email.toUpperCase();
        var upper_next = next.email.toUpperCase();
        return upper_prev < upper_next ? -1 :
            upper_prev > upper_next ? 1 : 0;
    });
}

function binarySearch(email) {
    email = email.toUpperCase();
    var mid, first, last;
    first = 0;
    last = Jobs.length - 1;
    while (first <= last) {
        mid = Math.floor((last + first) / 2);
        if (email === Jobs[mid].email)
            return mid;
        if (email > Jobs[mid].email)
            first = mid + 1;
        if (email < Jobs[mid].email)
            last = mid - 1;
    }
    return -1;
}

function insertItem(item) {
    var i = 0;
    while (Jobs[i].email < item.email)
        i++;
    Jobs.splice(i, 0, item);
}

function createRule(date, EmailPeriod) {
    var rule = new schedule.RecurrenceRule();
    const EmailTime = settings.NotificationEmailTime.split(':');
    rule.hour = parseInt(EmailTime[0]);
    rule.minute = parseInt(EmailTime[1]);
    switch (EmailPeriod) {
        case 'Daily':
            break;
        case 'Weekly':
            rule.dayOfWeek = [date.getDay()];
            break;
        case 'Monthly':
            rule.date = date.getDate();
            break;
        default:
    }
    return rule;
}
var automatic = {
    createJobSendEmail: function () {
        Jobs = [];
        models.User.getEmailUsers(users => {
            for (let i = 0; i < users.length; i++) {
                const date = new Date(users[i].TimeOption);
                const rule = createRule(date, users[i].EmailPeriod);
                const j = schedule.scheduleJob(rule, function (email, EmailPeriod) {
                    sendNewNotificationToEmail(email, EmailPeriod);
                }.bind(null, users[i].email, users[i].EmailPeriod));
                const item = {
                    email: users[i].email.toUpperCase(),
                    job: j,
                    EmailPeriod: users[i].EmailPeriod
                }
                Jobs.push(item);
            }
        });
    },
    updateJobs: function (email) {
        const index = binarySearch(email);
        if (index !== -1) {
            models.User.getUserByEmail(email, user => {
                if (user.isNotificationEmail === 0) {
                    Jobs[index].job.cancel();
                    Jobs.splice(index, 1);
                } else {
                    const date = new Date(user.TimeOption);
                    const rule = createRule(date, user.EmailPeriod);

                    Jobs[index].job.cancel();
                    Jobs[index].job = schedule.scheduleJob(rule, function (email) {
                        sendNewNotificationToEmail(email, user.EmailPeriod);
                    }.bind(null, user.email, user.EmailPeriod));
                }
            });
        } else {
            models.User.getUserByEmail(email, user => {
                if (user.isNotificationEmail === 1) {
                    const date = new Date(user.TimeOption);
                    const rule = createRule(date, user.EmailPeriod);
                    const j = schedule.scheduleJob(rule, function (email, EmailPeriod) {
                        sendNewNotificationToEmail(email, EmailPeriod);
                    }.bind(null, user.email, user.EmailPeriod));
                    const item = {
                        email: user.email.toUpperCase(),
                        job: j,
                        EmailPeriod: user.EmailPeriod
                    }
                    insertItem(item);

                }
            });
        }
    },

    // send email feed back in here
    // this function use libary cron-job of node-js
    sendMailFeedbackJob: function () {
        var arrUser;
        var job = new CronJob({
            // It mean send from monday to sunday at 10 AM
            cronTime: '*/30 * * * *',
            onTick: function () {
                // Cron job function start here
                models.emailFeedback.getAllInfoAboutUserDontFeedback(function (rs) {
                    if (rs !== null) {
                        let l = rs.length;
                        //Get all infomation of user, but only sent 15 man because it is limited by GOOGLE
                        if (l > 15) {
                            arrUser = [];
                            for (let i = 0; i < 15; i++) {
                                arrUser[i] = rs[i];
                            }
                        }
                        else {
                            arrUser = rs;
                        }
                        arrUser.forEach(user => {
                            // Two function below use class ID to get ness info
                            // Get content email array by class id, call function
                            models.Class.getContentEmailFeedBackByClassID(user.classId, (arrContentEmail) => {
                                if (arrContentEmail !== null) {
                                    // Get course naem by class ID
                                    models.Course.getCourseNameByClassId(user.classId, (arrCourseName) => {
                                        // add email info to email_feedback in sql
                                        models.emailFeedback.create({
                                            email_user: user.email,
                                            userID: user.traineeId,
                                            class_id_not_feedback: user.classId,
                                            lastdate_sent_emailfeedback: new Date()
                                        });
                                        sendEmail.send(user.email, arrCourseName[0].name, arrContentEmail[0], 7);
                                    })
                                }
                            })
                        });
                    }
                });
            },
            start: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        job.start();
    },
    updateStatusClassRecord: function () {
        var job = new CronJob({
            cronTime: '* * * * * *',
            onTick: function () {
                models.ClassRecord.getTimeOfClassRecordWithStatusEnrolled((result) => {
                    result.forEach(class_Record => {
                        if (Date.parse(class_Record.endTime) <= Date.parse(new Date)) {
                            models.ClassRecord.update({
                                status: 'Learned'
                            },
                                {
                                    where: { id: class_Record.id }
                                });
                        }
                    });
                });
            },
            start: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        })
        job.start();
    },
    sendMailReminderFeedback: function () {
        var arrUser;
        var job = new CronJob({
            // It mean send from monday to sunday at 10 AM
            cronTime: '*/59 * * * *',
            onTick: function () {
                models.emailFeedback.getAllInfoAboutUserIsSentEmailFeedbacMoreThreeDays(function (rs) {
                    if (rs !== null) {
                        let l = rs.length;
                        //Get all infomation of user, but only sent 15 man because it is limited by GOOGLE
                        if (l > 15) {
                            arrUser = [];
                            for (let i = 0; i < 15; i++) {
                                arrUser[i] = rs[i];
                            }
                        }
                        else {
                            arrUser = rs;
                        }
                        arrUser.forEach(user => {
                            // Two function below use class ID to get ness info
                            // Get content email array by class id, call function
                            models.Class.getContentEmailFeedBackByClassID(user.class_id_not_feedback, (arrContentEmail) => {
                                if (arrContentEmail !== null) {
                                    // Get course naem by class ID
                                    models.Course.getCourseNameByClassId(user.class_id_not_feedback, (arrCourseName) => {
                                        models.emailFeedback.update(
                                            { lastdate_sent_emailfeedback: new Date() },
                                            {
                                                where: {
                                                    email_user: user.email_user,
                                                    userID: user.userID,
                                                    class_id_not_feedback: user.class_id_not_feedback
                                                }
                                            })
                                        sendEmail.send(user.email_user, arrCourseName[0].name, arrContentEmail[0], 7);
                                    })
                                }
                            })
                        });
                    }
                })
            },
            start: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        job.start();
    },
}
module.exports = automatic;