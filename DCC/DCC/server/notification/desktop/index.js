var io;
var onlineUsers = [];
var models = require('../../models');

function binarySearch(key, first, last) {
    var mid;
    key = key.toUpperCase();
    while (first <= last) {
        mid = Math.floor((last + first) / 2);
        if (onlineUsers[mid].email) {
            if (key == onlineUsers[mid].email.toUpperCase())
                return mid;
            if (key > onlineUsers[mid].email.toUpperCase())
                first = mid + 1;
            if (key < onlineUsers[mid].email.toUpperCase())
                last = mid - 1;
        }
    }
    return -1;
}

function checkExistUserOnline(user) {
    for (let i = 0; i < onlineUsers.length; i++) {
        if (onlineUsers[i].email === user.email)
            return true;
    }
    return false;
}

var desktop = {
    send: function (receivers, subject, content) {
        var notification = {
            title: subject,
            msg: content
        };
        for (let i = 0; i < receivers.length; i++) {
            const index = binarySearch(receivers[i], 0, onlineUsers.length - 1);
            if (index !== -1) {
                onlineUsers[index].socket.emit('pushNotification', notification);
                // trigger user to update notification
                onlineUsers[index].socket.emit('updateNumberOfNewNotifications', {
                    message: "update"
                });
                onlineUsers[index].socket.emit('updateNumberOfNewNotificationsRequestCourse', {
                    message: "update"
                });
                onlineUsers[index].socket.emit('updateRequestOpenCourse', {
                    message: "update"
                });
                onlineUsers[index].socket.emit('updateAdminRequestOpenCourseList', {
                    message: "update"
                });
                onlineUsers[index].socket.emit('updateTraineeOfClass', {
                    message: "update"
                });
            }
        }
    },
    createSocketServer: createServer
}

function createServer(server_socket) {
    io = require('socket.io').listen(server_socket);

    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
            for (let i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].socket === socket) {
                    onlineUsers.splice(i, 1);
                    break;
                }
            }
        });

        // Use socket to communicate with this particular client only, sending it it's own id
        socket.on('sendEmail', function (data) {
            var item = {
                socket: socket,
                email: data.email
            };
            if (!checkExistUserOnline(item)) {
                onlineUsers.push(item);
            }
            //Sort list of user for optimize the search algorithm later
            models.Notifications.getNumberofNewNotification(data.userId, function (notifications) {
                socket.emit('NewNotifications', notifications.count);
            });
            models.Notifications.getNumberofNewNotificationRequestCourse(data.userId, function (notifications) {
                socket.emit('NewNotifications', notifications.count);
            });

            onlineUsers.sort(function (prevUser, nextUser) {
                if (prevUser.email && nextUser.email) {
                    var upper_prevUser = prevUser.email.toUpperCase();
                    var upper_nextUser = nextUser.email.toUpperCase();
                    return upper_prevUser < upper_nextUser ? -1 :
                        upper_prevUser > upper_nextUser ? 1 : 0;
                }

            });
        });
        socket.on('logout', function (data) {
            for (let i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === data.email) {
                    onlineUsers.splice(i, 1);
                    break;
                }
            }
        });
    });
};

module.exports = desktop;