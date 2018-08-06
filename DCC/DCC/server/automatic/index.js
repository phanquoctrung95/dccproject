var noti_class = require('./notification_class')
var jobSendMail = require('./job_send_email')
module.exports = {
    job_sendnoti_ClassStart: noti_class.job_sendnoti_ClassStart,
    job_sendEmail: {
        createJobSendEmail: jobSendMail.createJobSendEmail,
        updateJobs: jobSendMail.updateJobs,
        sendMailFeedbackJob: jobSendMail.sendMailFeedbackJob,
        sendMailReminderFeedback: jobSendMail.sendMailReminderFeedback
    },
    updateStatusClassRecord: {
        updateStatusClassRecord: jobSendMail.updateStatusClassRecord,
    }
}
