(function () {
    'use strict';

    angular
        .module('register', [])
        .factory('registerServices', registerServices)
        .controller('registerCtrl', registerCtrl);

    //Factory
    registerServices.$inject = ['$http'];

    function registerServices($http) {
        var factoryDefinitions = {
            addUser: function (user) {
                return $http.post("/user/userProfile/addUser", user).success(function (data) {
                    return data;
                });
            },
            getTeamName: function () {
                return $http.post("/team/team/getTeamName").success(function (data) {
                    return data;
                });
            },
            add: function (objdata) {
                return $http.post("/user_group/user_group/add", objdata).success(function (data) {
                    return data;
                });
            },
            getUserIDByUserEmail: function (userEmail) {
                return $http.post("/user/userProfile/getUserIDByUserEmail", userEmail).success(function (data) {
                    return data;
                });
            },
            getgroupNameList: function () {
                return $http.post('/group/group/getgroupName').success(function (data) {
                    return data;
                });
            },
        }
        return factoryDefinitions;
    }

    //Controllers
    registerCtrl.$inject = ['$scope', '$rootScope', 'registerServices'];

    function registerCtrl($scope, $rootScope, registerServices) {
        $scope.userEmail = '';
        $scope.userPassword = '';
        $scope.passwordAgain = '';
        $scope.courseTypeId = "Intern";
        $scope.passMeasuremessage = "";
        $scope.userID = '';
        $scope.groupID = null;

        // //get team
        registerServices.getgroupNameList().then(function (result) {
            console.log(result);
            $rootScope.groupName = result.data.data;
        });

        $scope.applyValue = function () {
            var randomstring = Math.random().toString(36).slice(-8);
            $scope.NewUser = {
                email: $scope.userEmail,
                username: $scope.userName,
                password: randomstring,
                userType: 'Intern'
            };
            if ($scope.groupSelected !== undefined) {
                // Assign value of team which is selected
                $scope.groupID = $scope.groupSelected.groupID;
                // Assign value of user Id 

                registerServices.addUser($scope.NewUser).then(function (result) {
                    if (result.data.success) {
                        // Get user id by email user which has created on top
                        registerServices.getUserIDByUserEmail({ userEmail: $scope.userEmail }).then(function (result1) {
                            $scope.userID = result1.data.data.id;
                            registerServices.add({ userID: $scope.userID, groupID: $scope.groupID }).then(function (result2) {
                                if (result2.data.success) {
                                    $rootScope.ShowPopupMessage("Add User Successfully", "success");
                                    $scope.groupName = $scope.groupSelected.groupID;
                                    $scope.userEmail = '';
                                    $scope.userName = '';
                                    $scope.userPassword = '';
                                    $scope.passwordAgain = '';
                                    $scope.courseTypeId = "Intern";
                                }
                                else {
                                    $rootScope.ShowPopupMessage("Fail to Add User", "error");
                                }
                            });
                        });
                    }
                    else {
                        $rootScope.ShowPopupMessage("Fail to Add User", "error");
                    }
                });
            }
            else {
                registerServices.addUser($scope.NewUser).then(function (result) {
                    if (result.data.success) {
                        $rootScope.ShowPopupMessage("Add User Successfully", "success");
                        $scope.userEmail = '';
                        $scope.userPassword = '';
                        $scope.passwordAgain = '';
                        $scope.courseTypeId = "Intern";
                        $scope.passMeasuremessage = "";
                        $scope.userID = '';
                        $scope.groupID = null;
                    }
                });
            }
        }
    }
})();