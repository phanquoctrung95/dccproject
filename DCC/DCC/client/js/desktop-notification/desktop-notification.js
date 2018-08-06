//var socket = io.connect('https://192.168.122.23:3210', {secure: true, reconnect: true, rejectUnauthorized : false});

var socket = io.connect('http://192.168.122.20:80');

socket.on('connect', () => {
    // to do
});

function connectSocket(email) {
    var data = {
        email: email
    }
    socket.emit('sendEmail', data);

}

socket.on('NewNotifications', function (numberNotification) {
    if (numberNotification > 0) {
        var noti = {
            title: 'Notice',
            msg: 'You have ' + numberNotification + ' new notifcations'
        }
        pushNotification(noti);
    }

});

socket.on('pushNotification', function (noti) {

    webNotification.showNotification(noti.title, {
        body: noti.msg,
        onClick: function () {
            hide();
        },
        icon: '/img/logo/DEK-Logo.png',
        autoClose: 14000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function (error, hide) {
        if (error) {
            window.alert('Unable to show notification: ' + error.message);
        } else {
            setTimeout(function () {
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
});

socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));

function pushNotification(noti) {

    webNotification.showNotification(noti.title, {
        body: noti.msg,
        onClick: function () {

        },
        icon: '/img/logo/DEK-Logo.png',
        autoClose: 14000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function (error, hide) {
        if (error) {
            window.alert('Unable to show notification: ' + error.message);
        } else {
            setTimeout(function () {
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
};
