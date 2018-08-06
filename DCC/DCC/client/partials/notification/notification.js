(function () {
    'use strict';
    angular.module('notification', [

    ])
        .factory('NotificationService', NotificationService)
        .controller('NotiController', NotiController);

    NotificationService.$inject = ['$http', '$rootScope'];

    function NotificationService($http, $rootScope) {
        var factoryDefinition = {
            updateNotificationSetting: function () {
                return $http.post('/user/userProfile/updateUserProfile', $rootScope.userInfo).success(function (data) {
                    return data;
                });
            },
            getNotifications: function (indexNoti) {
                return $http.post('/notification/notification/getNotifications', {
                    userId: $rootScope.userInfo.id,
                    index: indexNoti
                }).success(function (data) {
                    return data;
                });
            },
            getNotificationsRequestCourse: function (indexNoti) {
                return $http.post('/notification/notification/getNotificationsRequestCourse', {
                    userId: $rootScope.userInfo.id,
                    index: indexNoti
                }).success(function (data) {
                    return data;
                });
            },
            UpdateNotificationStatus: function (notification) {
                return $http.post('/notification/notification/updateNotificationStatus', notification).success(function (data) {
                    return data;
                });
            },
            getCoursebyName: function (CourseName) {
                return $http.post('/trainee/courseRegister/getCoursebyName', {
                    name: CourseName
                }).success(function (data) {
                    return data;
                });
            },
            getClassById: function (request) {
                return $http.post('/common/class/getClassById', request).success(function (data) {
                    return data;
                });
            },
            getCourseOfUserDontFeedbackByUserID: function (userID) {
                return $http.post('/common/course/getCourseOfUserDontFeedbackByUserID', userID).success(function (data) {
                    return data;
                })
            },
            getClassesNeedToFeedBack: function (nameTrainingProgram, tranieeId) {
                return $http.post('/trainee/dashboard/getClassesNeedToFeedBack', nameTrainingProgram, tranieeId).success(function (data) {
                    return data;
                });
            },
            addNotification: function (req) {
                return $http.post('/notification/notification/addNotification', req).success(function (data) {
                    return data;
                });
            }
        }
        return factoryDefinition;
    }


    NotiController.$inject = ['$scope', '$rootScope', '$location', '$state', '$anchorScroll', 'NotificationService', '$timeout'];
    function NotiController($scope, $rootScope, $location, $state, $anchorScroll, NotificationService, $timeout) {
        $scope.Dates = Array.from(Array(31), (val, index) => index + 1);
        $("#CardContent").on('hidden.bs.modal', () => {
            $rootScope.userInfo.limitNotifications = $rootScope.userInfo.userNotifications.slice(0, 10);
        })

        function convertDate(date) {
            var hour = date.getHours();
            var minute = date.getMinutes();
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() +
                " " + (hour % 12 || 12) + ":" + (minute < 10 ? '0' : '') + minute +
                ' ' + (hour >= 12 ? 'PM' : 'AM');
        }



        Date.prototype.setDay = function (dayOfWeek) {
            this.setDate(this.getDate() - this.getDay() + dayOfWeek);
        };
        // array save all noti
        $scope.getNotificationsList = function () {
            $('#CardContent').animate({
                scrollTop: 0
            }, 0);
            NotificationService.getNotifications(0).then(
                function (notifications) {
                    if (notifications.data.data) {
                        // sort noti, newest noti in top of scroll bar
                        for (let i = 0, j = notifications.data.data.length - 1; i < j; i++ , j--) {
                            const temp = notifications.data.data[i];
                            notifications.data.data[i] = notifications.data.data[j];
                            notifications.data.data[j] = temp;
                        }
                        // format time
                        for (let i = 0; i < notifications.data.data.length; i++) {
                            const date = new Date(notifications.data.data[i].time);
                            notifications.data.data[i].time = convertDate(date);

                        }
                        // add new noti to array
                        $rootScope.userInfo.userNotifications = [];
                        $rootScope.userInfo.userNotifications = [...$rootScope.userInfo.userNotifications, ...notifications.data.data];
                        $rootScope.userInfo.limitNotifications = $rootScope.userInfo.userNotifications.slice(0, 3);
                        $rootScope.userInfo.NumberofNewNotification = 0;
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = 0;


                    }
                });
        };
        $scope.getNotificationsRequestCourseList = function () {
            $('#CardContent').animate({
                scrollTop: 0
            }, 0);
            NotificationService.getNotificationsRequestCourse(0).then(
                function (notifications) {
                    if (notifications.data.data) {
                        // sort noti, newest noti in top of scroll bar
                        for (let i = 0, j = notifications.data.data.length - 1; i < j; i++ , j--) {
                            const temp = notifications.data.data[i];
                            notifications.data.data[i] = notifications.data.data[j];
                            notifications.data.data[j] = temp;
                        }
                        // format time
                        for (let i = 0; i < notifications.data.data.length; i++) {
                            const date = new Date(notifications.data.data[i].time);
                            notifications.data.data[i].time = convertDate(date);

                        }
                        // add new noti to array
                        $rootScope.userInfo.userNotificationsRequestCourse = [];
                        $rootScope.userInfo.userNotificationsRequestCourse = [...$rootScope.userInfo.userNotificationsRequestCourse, ...notifications.data.data];
                        // $rootScope.userInfo.limitNotifications = $rootScope.userInfo.userNotifications.slice(0,3);
                        $rootScope.userInfo.NumberofNewNotification = $rootScope.userInfo.NumberofNewNotification - $rootScope.userInfo.NumberofNewNotificationRequestCourse;
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = 0;

                    }
                });
        };

        $scope.SyncNotificationSetting = function () {
            $rootScope.userInfo.TimeOption = $rootScope.userInfo.TimeOption ? (new Date($rootScope.userInfo.TimeOption)) : (new Date());
            $rootScope.userInfo.WeekdayOption = $rootScope.userInfo.TimeOption.getDay();
            $rootScope.userInfo.DateOption = $rootScope.userInfo.TimeOption.getDate();
        };

        // Load notification in here which mean load more new notification
        $scope.LoadMorecNotification = function () {
            NotificationService.getNotifications($rootScope.userInfo.userNotifications.length).then(
                function (notifications) {
                    if (notifications.data.data) {

                        for (let i = 0, j = notifications.data.data.length - 1; i < j; i++ , j--) {
                            const temp = notifications.data.data[i];
                            notifications.data.data[i] = notifications.data.data[j];
                            notifications.data.data[j] = temp;
                        }
                        // format time
                        for (let i = 0; i < notifications.data.data.length; i++) {
                            const date = new Date(notifications.data.data[i].time);
                            notifications.data.data[i].time = convertDate(date);
                        }
                        // push new noti to array noti
                        $rootScope.userInfo.userNotifications = [...$rootScope.userInfo.userNotifications, ...notifications.data.data];
                        // add new noti to array show
                        $rootScope.userInfo.limitNotifications = $rootScope.userInfo.limitNotifications
                            .concat($rootScope.userInfo.userNotifications
                                .slice($rootScope.userInfo.limitNotifications.length, $rootScope.userInfo.limitNotifications.length + 10))
                    }
                });
        };

        $scope.SaveSetting = function () {
            if ($rootScope.userInfo.isNotificationEmail) {
                switch ($rootScope.userInfo.EmailPeriod) {
                    case 'Daily': //This case has been handled synchronously
                        break;

                    case 'Weekly':
                        $rootScope.userInfo.TimeOption.setDay($rootScope.userInfo.WeekdayOption);
                        break;

                    case 'Monthly':
                        $rootScope.userInfo.TimeOption.setDate($rootScope.userInfo.DateOption);
                        break;
                    default:
                        $rootScope.userInfo.TimeOption = new Date(); //set to current time if other case happen
                        break;
                }
            }
            NotificationService.updateNotificationSetting().then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage("Settings saved", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Update Settings", "error");
                }
            });
        };

        $scope.UpdateNotificationStatus = function (notification) {
            NotificationService.UpdateNotificationStatus(notification).then(function () {
                if(notification.title == "Feedback") // noti feedback thi bat modal feedback len
                {
                    $state.go('trainee_dashboard').then(function () {
                       // id is collapse_feedback
                       $('#collapse_feedback').modal({ // bật modal lên
                           show: 'true'
                       })
                    });
                }
                else if (notification.reference) { // nguoc lai thi di vao cac trang khac
                    var link = notification.reference.split("/");
                    if (link != null) {
                        switch (link[0]) {
                            case 'trainee_dashboard':
                                $state.go('trainee_dashboard').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                    effectFocus(link[1]);
                                });
                                break;
                            case 'courseDetail':
                                NotificationService.getCoursebyName(link[1]).then(function (res) {
                                    $state.go('courseDetail', {
                                        courseId: res.data.course.id
                                    }).then(function () {
                                        $location.hash(link[1]);
                                        $anchorScroll(link[1]);
                                    });
                                });
                                break;
                            case 'trainee_courseRegister':
                                $state.go('trainee_courseRegister').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                });
                                break;
                            case 'admin_courseManagement':
                                $state.go('admin_courseManagement').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                });
                                break;
                            case 'admin_classAdding':
                                $state.go('admin_classAdding').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                });
                                break;
                            case 'login_user':
                                $state.go('login_user').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                });
                                break;
                            case 'admin_dashboard':
                                $state.go('admin_dashboard').then(function () {
                                    $location.hash(link[1]);
                                    $anchorScroll(link[1]);
                                    effectFocus(link[1]);
                                });
                                break;
                            case 'detail_notification':
                                NotificationService.getClassById({ id: link[1] }).then(function (result) {
                                    if (result.data.data) {
                                        $state.go('detail_notification').then(function () {
                                            $location.hash(link[1]);
                                            $anchorScroll(link[1]);
                                            effectFocus(link[1]);
                                        });
                                    }
                                    else {
                                        $rootScope.ShowPopupMessage("Class have been deleted", "error");
                                    }
                                });
                                break;
                            default:
                                $state.go('home');
                        }
                    }
                }

            });
        }
    }
})();

function effectFocus(link) {
    var id = document.getElementById(link);
    if (id) {
        id.style.transition = "all .5s";
        var count = 0;
        id.style.background = "#ccc";
        var effect = setInterval(function () {
            if (count % 2 == 0) {
                id.style.background = "white";
                count++;
            } else if (count % 2 != 0) {
                id.style.background = "#ccc";
                count++;
            }
            if (count > 2) {
                clearInterval(effect);
            }
        }, 600);
    } else {
    }
}
