
(function () {
    'use strict';
    angular
        .module('EmployeesManagement', [])
        .factory('EmployeesManagementService', EmployeesManagementService)
        .controller('getProfilesController', getProfilesController)
        .controller('activateUserCtrl', activateUserCtrl)



    EmployeesManagementService.$inject = ['$http'];

    function EmployeesManagementService($http) {
        var factoryDefinition = {
            getProfilesList: function () {
                return $http
                    .get('/user/userProfile/getAllUsers')
                    .success(function (data) {
                        return data;
                    });
            },

            updateUserStatus: function (user) {
                return $http
                    .post('/user/userProfile/updateUserProfile', user)
                    .success(function (data) {
                        return data;
                    });
            },
            getClassRecordByTrainerId: function (trainerID) {
                return $http.post('/common/classrecord/getClassRecordByTrainerId', trainerID).success(function (data) {
                    return data;
                });
            },
            getClassById: function (request) {
                return $http.post('/common/class/getClassById', request).success(function (data) {
                    return data;
                });
            }
        }
        return factoryDefinition;
    }

    getProfilesController.$inject = ['$scope', '$rootScope', '$sce', 'EmployeesManagementService'];
    var dataOfEmployees;
    var gpalenght = 0;
    var GPAScore = 0;
    var TrainerRaitingList = [];
    function getProfilesController($scope, $rootScope, $sce, EmployeesManagementService) {
        EmployeesManagementService
            .getProfilesList()
            .then(function (userData) {
                $scope.UsersList = [];
                userData
                    .data
                    .data
                    .forEach(function (user) {
                        $scope.UsersList.push(user);
                        if (user.isTrainer) {
                            EmployeesManagementService.getClassRecordByTrainerId({ trainerID: user.id }).then(function (result) {
                                GPAScore = 0;
                                gpalenght = 0;
                                result.data.data.forEach(element => {
                                    if (element.trainer_rating) {
                                        GPAScore += element.trainer_rating;
                                        gpalenght++;
                                    }
                                });
                                if (gpalenght != 0)
                                    GPAScore /= gpalenght;
                                var temp = { id: user.id, GPA: GPAScore };
                                TrainerRaitingList.push(temp);
                            });
                        }
                    });

                dataOfEmployees = $scope.UsersList;
                $scope.sortbyName();
                $scope.opt = '1';
                $scope.trainOptions = '3';

            });


        $scope.GPA = function (userID) {
            var score = 0;
            for (var i = 0; i < TrainerRaitingList.length; i++) {
                if (TrainerRaitingList[i].id == userID) {
                    score = TrainerRaitingList[i].GPA.toFixed(2);
                }
            }

            return '<span>' + score + ' </span>';
        }

        $scope.highlight = function (text, search) {

            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        };

        $scope.sortbyArea = function () {
            $scope
                .UsersList
                .sort(function (prevUser, nextUser) {
                    var upper_prevUser = prevUser
                        .userType
                        .toUpperCase();
                    var upper_nextUser = nextUser
                        .userType
                        .toUpperCase();

                    return upper_prevUser < upper_nextUser ?
                        -1 :
                        upper_prevUser > upper_nextUser ?
                            1 :
                            0;
                });
        };
        // dataOfEmployees = $scope.UsersList;
        $scope.$watch('trainOptions', function (newValue) {
            var data = dataOfEmployees;
            if (newValue == 1) {
                let dataVersion2 = [];
                data.forEach(element => {
                    if (element.isTrainer) {

                        dataVersion2.push(element);
                    }
                });
                $scope.UsersList = dataVersion2;
            }
            if (newValue == 2) {
                let dataVersion2 = [];
                data.forEach(element => {
                    if (element.isTrainee)
                        dataVersion2.push(element);
                });
                $scope.UsersList = dataVersion2;
            }
            if (newValue == 3)
                $scope.UsersList = data;
        });
        $scope.sortbyTeam = function () {
            $scope
                .UsersList
                .sort(function (prevUser, nextUser) {
                    var upper_prevUser = prevUser
                        .belong2Team
                        .toUpperCase();
                    var upper_nextUser = nextUser
                        .belong2Team
                        .toUpperCase();

                    return upper_prevUser < upper_nextUser ?
                        -1 :
                        upper_prevUser > upper_nextUser ?
                            1 :
                            0;
                });
        };

        $scope.sortbyName = function () {
            $scope
                .UsersList
                .sort(function (prevUser, nextUser) {
                    var upper_prevUser = prevUser
                        .username
                        .toUpperCase();
                    var upper_nextUser = nextUser
                        .username
                        .toUpperCase();

                    return upper_prevUser < upper_nextUser ?
                        -1 :
                        upper_prevUser > upper_nextUser ?
                            1 :
                            0;
                });
        };

        $scope.sortbyStatus = function () {
            var head = 0,
                tail = $scope.UsersList.length - 1;
            var statusValues = ($scope.UsersList.sortOrder === 1) ? ['deactivated', 'activated'] : ['activated', 'deactivated'];
            while (head < tail) {
                while ($scope.UsersList[head].status === statusValues[0] && head < tail)
                    head++;
                while ($scope.UsersList[tail].status === statusValues[1] && head < tail)
                    tail--;

                //swap
                if (head < tail) {
                    var temp = $scope.UsersList[head];
                    $scope.UsersList[head] = $scope.UsersList[tail];
                    $scope.UsersList[tail] = temp;
                }
            }
            $scope.UsersList.sortOrder = ($scope.UsersList.sortOrder === 1) ?
                0 :
                1;
        };

        $scope.showUserActivationForm = function (user) {
            $rootScope.selectedActivationUser = user;
        };
        $scope.checkSearch = function (user, searchkey) {
            let checkSearch = true;
            if (searchkey) {
                // filt by name
                var nameSearch = user.username.toUpperCase().includes(searchkey.toUpperCase());
                // email
                var emailSearch = user.email.toUpperCase().includes(searchkey.toUpperCase());
                // dob
                var dobSearch = user.dob.toUpperCase().includes(searchkey.toUpperCase());
                // phone
                var phoneSearch = user.phone && user.phone.toUpperCase().includes(searchkey.toUpperCase());
                // team name
                var teamSearch = user.belong2Team && user.belong2Team.toUpperCase().includes(searchkey.toUpperCase());
                // type account
                var typeSearch = user.userType && user.userType.toUpperCase().includes(searchkey.toUpperCase());

                // return filter search
                checkSearch = nameSearch || emailSearch || dobSearch;
                if (!checkSearch) {
                    checkSearch = phoneSearch || teamSearch || typeSearch;
                }
            }
            return checkSearch;
        }
        // filter user to display for each condition
        $scope.userListFilterCondition = function (user) {
            // show user actived if opt = 1
            var isActivated = (user.status === 'activated') && ($scope.opt === '1');
            // show user deactived if opt = 2
            var isDeactivated = (user.status === 'deactivated') && ($scope.opt === '2');
            // show all user if opt = 3 
            var isAll = ($scope.opt === '3');
            // 
            var checkStatus = isActivated || isDeactivated || isAll;
            // filter user by search ke
            var checkSearch = $scope.checkSearch(user, $scope.userSearchKey);

            return checkStatus && checkSearch;
        };
        $scope.updateUserRole = function (user) {
            EmployeesManagementService
                .updateUserStatus(user)
                .then(function (result) {
                    if (result.data.success) {
                        $rootScope.ShowPopupMessage("Role Saved", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Update Role", "error");
                    }
                });
        };
    }

    activateUserCtrl.$inject = ['$scope', '$rootScope', 'EmployeesManagementService'];

    function activateUserCtrl($scope, $rootScope, EmployeesManagementService) {
        $scope.toggleUserActivationStatus = function () {
            $rootScope.selectedActivationUser.status = ($rootScope.selectedActivationUser.status === 'activated' ?
                'deactivated' :
                'activated');
            EmployeesManagementService
                .updateUserStatus($rootScope.selectedActivationUser)
                .then(function (result) {
                    if (result.data.success) {
                        if ($rootScope.selectedActivationUser.status === 'activated')
                            $rootScope.ShowPopupMessage($rootScope.selectedActivationUser.username + ' reactivated', "success");
                        else
                            $rootScope.ShowPopupMessage($rootScope.selectedActivationUser.username + ' deactivated', "error");
                        $rootScope.selectedActivationUser = undefined;
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Update Status", "error");
                    }
                });
        };
    }

})();