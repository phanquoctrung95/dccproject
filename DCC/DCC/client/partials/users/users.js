(function () {
    'use strict';
    angular
        .module('users', [])
        .factory('userServices', userServices)
        .directive('fileModel', fileModel)
        .controller('loginController', loginController)
        .controller('changePasswordController', changePasswordController)
        .controller('logoutController', logoutController)
        .controller('userProfileCtrl', userProfileCtrl)
        .controller('login', login)

    fileModel.$inject = ['$parse'];
    function fileModel($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope
                        .$apply(function () {
                            modelSetter(scope, element[0].files[0]);
                        });
                });
            }
        };
    }

    userServices.$inject = ['$http', '$rootScope', '$q'];

    function userServices($http, $rootScope) {
        var factoryDefinitions = {
            login: function (loginReq) {
                return $http
                    .post('/login', loginReq)
                    .success(function (data) {
                        return data;
                    });
            },
            logout: function () {
                return $http
                    .get('/logout')
                    .success(function (data) {
                        return data;
                    });
            },
            getUserById: function (id) {
                return $http
                    .post('/user/userProfile/getUserById', id)
                    .success(function (data) {
                        return data;
                    });
            },
            getUserProfile: function (user) {
                return $http
                    .post('/user/userProfile/getUserInfo', user)
                    .success(function (data) {
                        return data;
                    });
            },
            updateUserProfile: function (emailReq) {
                var warn = "Are you sure you want to do this ?";
                if (!confirm(warn)) {
                    exit();
                }
                return $http
                    .post('/user/userProfile/updateUserProfile', emailReq)
                    .success(function (data) {
                        return data;
                    });
            },
            checkPassword: function (user) {
                return $http
                    .post('/user/userProfile/checkPassword', user)
                    .success(function (data) {
                        return data
                    });
            },
            changePasswordMD5: function (emailReq) {
                return $http
                    .post('/user/userProfile/changePasswordMD5', emailReq)
                    .success(function (data) {
                        return data;
                    });
            },
            getNumberofNewNotifications: function () {
                return $http
                    .post('/notification/notification/getNumberofNewNotification', { userId: $rootScope.userInfo.id })
                    .success(function (data) {
                        return data;
                    });
            },
            getNumberofNewNotificationsRequestCourse: function () {
                return $http
                    .post('/notification/notification/getNumberofNewNotificationRequestCourse', { userId: $rootScope.userInfo.id })
                    .success(function (data) {
                        return data;
                    });
            },
            getAllUsers: function () {
                return $http.get('/user/userProfile/getAllUsers'); //goij phuowng thuwcs get toiws router //trar veef mootj data
            },
            getAllUserDontLearnByGroupID: function (groupID) {
                return $http
                    .post('/user/userProfile/getAllUserDontLearnByGroupID', groupID)
                    .success(function (data) {
                        return data;
                    }); //goij phuowng thuwcs get toiws router //trar veef mootj data
            },
            getAllUserByCourseID: function (courseID) {
                return $http
                    .post('/user/userProfile/getAllUserByCourseID', courseID)
                    .success(function (data) {
                        return data;
                    }); //laasy User chuwa hojc Course
            },
            getUserDontFeedbackByCourseID: function (courseID) {
                return $http
                    .post('/user/userProfile/getUserDontFeedbackByCourseID', courseID)
                    .success(function (data) {
                        return data;
                    });
            },
            recoveryPasswordMD5: function (emailReq) {
                return $http
                    .post('/user/userProfile/recoveryPassword', emailReq) //chuwa dduowjc caif dawtj API
                    .success(function (data) {
                        return data;
                    });
            },
            uploadFileToUrl: function (file, uploadUrl) {
                var fd = new FormData();
                fd.append('file', file);
                return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'email': $rootScope.userInfo.email

                    }
                    // body: {
                    //     'email': $rootScope.userInfo.email
                    // }
                });
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
            },
            getClassById: function (request) {
                return $http.post('/common/class/getClassById', request).success(function (data) {
                    return data;
                });
            },
            updateStatusConfirmJoin: function (req) {
                return $http.post('/common/classrecord/updateStatusConfirmJoin', req).success(function (data) {
                    return data;
                });
            }
        }

        return factoryDefinitions;
    }
    //function jump from parameter url
    // jumpUrl.$inject = ['$state'];
    function jumpUrl($state, $rootScope, userServices, parameter, parameterOfConfirm) {
        //format of url http://localhost:5000/#/login_user/confirm?cofirm=YES&classId=443
        //parameter = cofirm
        //parameterOfConfirm = {cofirm:YES,classId:443}
        switch (parameter) {
            case "feedback":
                $state.go('trainee_dashboard').then(function () {
                    // id is collapse_feedback
                    $('#collapse_feedback').modal({ // bật modal lên
                        show: 'true'
                    })
                });
                break;
            case "confirm":
                $state.go('home').then(function () {
                    var startTimeOfClassID;
                    var checkIntClassId = (/^-?[0-9]+$/).test(parameterOfConfirm.classId); //check classID is Number
                    parameterOfConfirm.cofirm = parameterOfConfirm.cofirm.toUpperCase(); //UpperCase yes/no
                    var checkYesNoCofirm = (/^(?:YES|NO)$/).test(parameterOfConfirm.cofirm); //check format yes/no
                    if (checkIntClassId && checkYesNoCofirm && parameterOfConfirm.cofirm.length <= 3) {
                        userServices.getClassById({ id: parameterOfConfirm.classId }).then(function (result) {
                            if (result.data.data != null) {
                                startTimeOfClassID = moment(result.data.data.startTime).format("LLL");
                                if (new Date(startTimeOfClassID.valueOf()) < new Date().valueOf()) //compare with current, if starttime < current
                                {
                                    //do nothing, show Pop up not allow
                                    $rootScope.ShowPopupMessage("Not Allow", "error");
                                }
                                else { //update database
                                    var request = {
                                        cofirm: parameterOfConfirm.cofirm,
                                        classId: parameterOfConfirm.classId,
                                        traineeId: $rootScope.userInfo.id
                                    }
                                    userServices.updateStatusConfirmJoin(request).then(function (data) { //update confirmJoin in database table class_record
                                        if (data.data.success)
                                            $rootScope.ShowPopupMessage("Thank you for your submit", "success");
                                        else
                                            $rootScope.ShowPopupMessage("Not Allow", "error");
                                    })
                                }
                            }
                            else
                            {
                                $rootScope.ShowPopupMessage("Not Allow", "error");
                            }
                        });
                    }
                    else {
                        $rootScope.ShowPopupMessage("Not Allow", "error");
                    }
                });
                break;
            default:
                $state.go('home');
        }
    }
    //login_user
    login.$inject = ['$scope', 'userServices', '$location', '$rootScope', '$window', '$state'];

    function login($scope, userServices, $location, $rootScope, $window, $state) {
        var parameterOfConfirm = $location.$$search;
        var parameterOfUrl = $state.params.param1;
        if (window.sessionStorage["userInfo"] != undefined) {
            jumpUrl($state, $rootScope, userServices, parameterOfUrl, parameterOfConfirm);
        }
        if (window.sessionStorage["userInfo"]) {
            userServices
                .getNumberofNewNotifications()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                    }

                });
            userServices
                .getNumberofNewNotificationsRequestCourse()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                    }

                });
        }

        socket.on('updateNumberOfNewNotifications', (response) => {
            if (response.message === "update") {
                userServices
                    .getNumberofNewNotifications()
                    .then(function (NewNotification) {
                        if (NewNotification) {
                            $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                        }
                    });
            }
        });
        socket.on('updateNumberOfNewNotificationsRequestCourse', (response) => {
            if (response.message === "update") {
                userServices
                    .getNumberofNewNotificationsRequestCourse()
                    .then(function (NewNotification) {
                        if (NewNotification) {
                            $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                        }
                    });
            }
        });

        function loginSucessDestination() {
            connectSocket($rootScope.userInfo.email);
            userServices
                .getNumberofNewNotifications()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                    }

                });
            userServices
                .getNumberofNewNotificationsRequestCourse()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                    }

                });
        }

        $scope.CheckCookie = function () {
            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            var userEmail = getCookie("email");
            if (userEmail !== "" && $window.localStorage['token']) {
                userServices
                    .getUserProfile({ email: userEmail })
                    .then(function (userData) {
                        $rootScope.userInfo = userData.data;
                        $rootScope.userInfo.role = $rootScope.userInfo.isAdmin
                            ? 1
                            : $rootScope.userInfo.isTrainer
                                ? 2
                                : $rootScope.userInfo.isTrainee
                                    ? 3
                                    : 0;
                        window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                        loginSucessDestination();
                    });
            }
            if ($rootScope.userInfo) {
                $rootScope.userInfo.role = $rootScope.userInfo.isAdmin
                    ? 1
                    : $rootScope.userInfo.isTrainer
                        ? 2
                        : $rootScope.userInfo.isTrainee
                            ? 3
                            : 0;
            }
        }
        $scope.login = {};
        $scope.doLogin = function () {
            if ($scope.loginForm.$valid) {
                userServices
                    .login($scope.login)
                    .then(function (result) {

                        $scope.data = result;
                        if (result.data.success) {
                            $window.localStorage['token'] = result.data.token;
                            window.sessionStorage["userInfo"] = JSON.stringify(result.data.data);

                            $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                            $rootScope.userInfo.role = result.data.role;
                            $rootScope.ShowPopupMessage("You Are Authenticated", "success");
                            loginSucessDestination();
                            //set the cookie to remember account
                            if ($scope.RememberMe && document.cookie) {
                                let time = new Date();
                                time.setFullYear(9999); //cookie never expires
                                document.cookie = "email=" + $rootScope.userInfo.email + ";expires=" + time + ";path=/";
                            } else if (document.cookie) {
                                let time = new Date();
                                time.setDate(time.getDate() + 1); //set cookies 1 days
                                document.cookie = "email=" + $rootScope.userInfo.email + ";expires=" + time + ";path=/";
                            }
                            //adding here
                            userServices.getClassesNeedToFeedBack({
                                trainingProgramId: $scope.trainingProgramId,
                                traineeId: $rootScope.userInfo.id
                            }).then(function (result) {
                                var length = result.data.data.length;
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                var dateTime = date + ' ' + time;
                                if (length != 0) { // co noti cần feedback
                                    var email = $rootScope.userInfo.email;
                                    var userId = $rootScope.userInfo.id;
                                    var req = {
                                        email: email,
                                        title: "Feedback",
                                        content: "You have <b style='color:black;'>" + length + "</b> feedback",
                                        time: dateTime,
                                        status: 1,
                                        reference: 'trainee_dashboard', // need to link of feedback
                                        userId: userId
                                    }
                                    var p1 = new Promise(function (resolve, reject) // xu ly bat dong bo
                                    {
                                        userServices
                                            .addNotification(req).then(function (result) {
                                                if (result.data.result == 0) {
                                                    reject(result);
                                                }
                                                else {
                                                    resolve(result);
                                                }
                                            })

                                    });
                                    p1.then(function () {
                                        userServices.getNumberofNewNotifications().then(function (NewNotification) { // update number of noti
                                            if (NewNotification) {
                                                $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                                            }

                                        });
                                    })
                                }
                                jumpUrl($state, $rootScope, userServices, parameterOfUrl, parameterOfConfirm);
                            });

                        } else {
                            $rootScope.ShowPopupMessage("Fail to Login", "error");
                        }
                    });
            }
        };
    }

    //Controllers
    loginController.$inject = ['$scope', 'userServices', '$location', '$rootScope', '$window', '$state'];

    function loginController($scope, userServices, $location, $rootScope, $window, $state) {

        if (window.sessionStorage["userInfo"]) {
            userServices
                .getNumberofNewNotifications()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                    }

                });
            userServices
                .getNumberofNewNotificationsRequestCourse()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                    }

                });
        }

        socket.on('updateNumberOfNewNotifications', (response) => {
            if (response.message === "update") {
                userServices
                    .getNumberofNewNotifications()
                    .then(function (NewNotification) {
                        if (NewNotification) {
                            $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                        }
                    });
            }
        });
        socket.on('updateNumberOfNewNotificationsRequestCourse', (response) => {
            if (response.message === "update") {
                userServices
                    .getNumberofNewNotificationsRequestCourse()
                    .then(function (NewNotification) {
                        if (NewNotification) {
                            $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                        }
                    });
            }
        });

        function loginSucessDestination() {
            // if ($rootScope.userInfo.status === 'newuser') {
            //     $('#firstPassword').modal({backdrop: 'static', keyboard: false})
            //     $('#firstPassword').modal('show');
            // } else {
            //     if ($rootScope.userInfo.role === 3) {
            //         $location.path("/trainee_dashboard");
            //     } else if ($rootScope.userInfo.role === 2) {
            //         $location.path("/trainer_dashboard");
            //     } else if ($rootScope.userInfo.role === 1) {
            //         $location.path("/admin_dashboard");
            //     }
            // }
            connectSocket($rootScope.userInfo.email);
            userServices
                .getNumberofNewNotifications()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                    }

                });
            userServices
                .getNumberofNewNotificationsRequestCourse()
                .then(function (NewNotification) {
                    if (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotificationRequestCourse = NewNotification.data.data;
                    }

                });
        }

        $scope.CheckCookie = function () {
            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) === 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            var userEmail = getCookie("email");
            if (userEmail !== "" && $window.localStorage['token']) {
                userServices
                    .getUserProfile({ email: userEmail })
                    .then(function (userData) {
                        $rootScope.userInfo = userData.data;
                        $rootScope.userInfo.role = $rootScope.userInfo.isAdmin
                            ? 1
                            : $rootScope.userInfo.isTrainer
                                ? 2
                                : $rootScope.userInfo.isTrainee
                                    ? 3
                                    : 0;
                        window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                        loginSucessDestination();
                    });
            }
            if ($rootScope.userInfo) {
                $rootScope.userInfo.role = $rootScope.userInfo.isAdmin
                    ? 1
                    : $rootScope.userInfo.isTrainer
                        ? 2
                        : $rootScope.userInfo.isTrainee
                            ? 3
                            : 0;
            }
        }
        $scope.login = {};
        $scope.doLogin = function () {
            if ($scope.loginForm.$valid) {
                userServices
                    .login($scope.login)
                    .then(function (result) {

                        $scope.data = result;
                        if (result.data.success) {
                            $window.localStorage['token'] = result.data.token;
                            window.sessionStorage["userInfo"] = JSON.stringify(result.data.data);

                            $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                            $rootScope.userInfo.role = result.data.role;
                            $rootScope.ShowPopupMessage("You Are Authenticated", "success");
                            loginSucessDestination();
                            //set the cookie to remember account
                            if ($scope.RememberMe && document.cookie) {
                                let time = new Date();
                                time.setFullYear(9999); //cookie never expires
                                document.cookie = "email=" + $rootScope.userInfo.email + ";expires=" + time + ";path=/";
                            } else if (document.cookie) {
                                let time = new Date();
                                time.setDate(time.getDate() + 1); //set cookies 1 days
                                document.cookie = "email=" + $rootScope.userInfo.email + ";expires=" + time + ";path=/";
                            }
                            //adding here
                            userServices.getClassesNeedToFeedBack({
                                trainingProgramId: $scope.trainingProgramId,
                                traineeId: $rootScope.userInfo.id
                            }).then(function (result) {
                                var length = result.data.data.length;
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                var dateTime = date + ' ' + time;
                                if (length != 0) { // co noti cần feedback
                                    var email = $rootScope.userInfo.email;
                                    var userId = $rootScope.userInfo.id;
                                    var req = {
                                        email: email,
                                        title: "Feedback",
                                        content: "You have <b style='color:black;'>" + length + "</b> feedback",
                                        time: dateTime,
                                        status: 1,
                                        reference: 'trainee_dashboard', // need to link of feedback
                                        userId: userId
                                    }
                                    var p1 = new Promise(function (resolve, reject) // xu ly bat dong bo
                                    {
                                        userServices
                                            .addNotification(req).then(function (result) {
                                                if (result.data.result == 0) {
                                                    reject(result);
                                                }
                                                else {
                                                    resolve(result);
                                                }
                                            })

                                    });
                                    p1.then(function () {
                                        userServices.getNumberofNewNotifications().then(function (NewNotification) { // update number of noti
                                            if (NewNotification) {
                                                $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                                            }

                                        });
                                    })
                                    .catch(function(){
                                        //ignore
                                    })
                                }
                                $state.reload();
                            });

                        } else {
                            $rootScope.ShowPopupMessage("Fail to Login", "error");
                        }
                    });
            }
        };
        $scope.doRecovery = function () {
            userServices
                .recoveryPasswordMD5({ email: $scope.forgot.email })
                .then(function (result) {
                    if (result.data.success) {
                        $rootScope.ShowPopupMessage("Your new password is sent to your email", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Your email invalid or something wrong", "error");
                    }
                });
        }
    }

    changePasswordController.$inject = ['$scope', 'userServices', '$location', '$rootScope'];

    function changePasswordController($scope, userServices, $location, $rootScope) {
        $scope.changePassword = {};
        $scope.passMeasuremessage = "";
        $scope.confirmChange = function () {
            userServices
                .getUserProfile($rootScope.userInfo)
                .then(function (userData) {
                    userData.data.role = $rootScope.userInfo.role;
                    $rootScope.userInfo = userData.data;
                    $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
                    $scope.userDetail.password = $scope.changePassword.oldPassword;
                    userServices
                        .checkPassword($scope.userDetail)
                        .then(function (result) {
                            if (result.data.success) {
                                $scope.userDetail.password = $scope.changePassword.newPassword;
                                userServices
                                    .changePasswordMD5($scope.userDetail)
                                    .then(function (result) {
                                        if (result.data.success) {
                                            userServices
                                                .getUserProfile($scope.userDetail)
                                                .then(function (userData) {
                                                    $rootScope.userInfo = userData.data;
                                                    window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                                                    $rootScope.ShowPopupMessage("Change Password Successfully", "success");
                                                    $location.path("/userProfile");
                                                })
                                        } else {
                                            $rootScope.ShowPopupMessage(result.data.msg, "error");
                                        }
                                    });
                            } else {
                                $rootScope.ShowPopupMessage("Current password is not correct!", "error");
                            }
                        })
                });
        };
        $scope.firstPassword = {};
        $scope.firstConfirmChange = function () {
            $rootScope.userInfo.password = $scope.firstPassword.newPassword;
            userServices
                .changePasswordMD5($rootScope.userInfo)
                .then(function (result) {
                    if (result.data.success) {
                        userServices
                            .getUserProfile($rootScope.userInfo)
                            .then(function (userData) {
                                $rootScope.userInfo = userData.data;
                                window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                                $rootScope.ShowPopupMessage("Change Password Successfully", "success");
                                $location.path("/userProfile");
                            })
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Change Password", "error");
                    }
                });
        };
    }

    logoutController.$inject = ['$scope', 'userServices', '$location', '$rootScope', '$window'];

    function logoutController($scope, userServices, $location, $rootScope, $window) {
        userServices
            .logout()
            .then(function () {
                socket.emit('logout', { email: $rootScope.userInfo.email });
                delete $window.localStorage['token'];
                sessionStorage.clear();
                $rootScope.userInfo = false;
                $rootScope.ShowPopupMessage("Logout successfully", "success");
                $location.path("/home");
                //erase cookie
                document.cookie = "email=;expires=" + (Date.now() - 1000) + ";path=/";
            });
    }

    userProfileCtrl.$inject = [
        '$scope',
        'userServices',
        '$location',
        '$rootScope',
        '$window',
        '$state'
    ];

    function userProfileCtrl($scope, userServices, $location, $rootScope, $window, $state) {
        userServices
            .getUserProfile($rootScope.userInfo)
            .then(function (userData) {
                userData.data.role = $rootScope.userInfo.role;
                $rootScope.userInfo = userData.data;
                $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
            })

        $scope.uploadAvatar = function () {
            var file = $scope.userImage;
            var uploadUrl = "/user/userProfile/photo";
            userServices
                .uploadFileToUrl(file, uploadUrl)
                .then((res) => {
                    if (res.data.success) {
                        $rootScope.userInfo.avatar = res.data.link;
                        $scope.userDetail.avatar = res.data.link;
                        window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                        $state.go('editUserProfile');
                        $rootScope.ShowPopupMessage("Update User Avatar Successful", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Update User Avatar Failed", "error");
                    }
                }, (err) => {
                    $rootScope.ShowPopupMessage("Update User Avatar Failed", "error");
                });
        }

        //update User Profile
        $scope.updateUserProfile = function () {
            userServices
                .updateUserProfile($scope.userDetail)
                .then(function (result) {
                    if (result.data.success) {
                        userServices
                            .getUserProfile($scope.userDetail)
                            .then(function (userData) {
                                $rootScope.userInfo = userData.data;
                                window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                                $rootScope.ShowPopupMessage("Update User Profile Successfully", "success");
                                $location.path("/userProfile");
                            })
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Update User Profile", "error");
                    }
                });
        };
        $scope.cancel = function () {
            $rootScope.ShowPopupMessage("Ignore all changes", "info");
            $location.path("/userProfile");
        };
    }
})();
