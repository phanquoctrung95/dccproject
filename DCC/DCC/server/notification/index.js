var email = require('./email');
var desktop = require('./desktop');
var models = require('../models');

function send(receivers, userId, subject, contentDesktop, contentEmail, link, stats, flag = 0) {
    models.User.getAllUsers(listUser => {
        let arr_desktop = [];
        let arr_email = [];
        let hashTable = [];
        for (let i = 0; i < listUser.length; i++) {
            hashTable[listUser[i].email] = {
                isNotificationEmail: listUser[i].isNotificationEmail,
                isNotificationDesktop: listUser[i].isNotificationDesktop
            }
        }

        for (let i = 0; i < receivers.length; i++) {
            if (hashTable[receivers[i]] && hashTable[receivers[i]].isNotificationDesktop === true) {
                arr_desktop.push(receivers[i]);
            }
            if (hashTable[receivers[i]] && hashTable[receivers[i]].isNotificationEmail === true) {
                arr_email.push(receivers[i]);
            }
            models.Notifications.create({
                email: receivers[i],
                userId: userId[i],
                title: subject,
                content: contentDesktop,
                time: new Date(),
                status: stats,
                reference: link
            });
        }


        if (arr_desktop.length > 0)
            desktop.send(arr_desktop, subject, contentDesktop, link);
        if (arr_email.length > 0)
            email.send(arr_email, subject, contentEmail, flag);

    });

}


module.exports = send;
