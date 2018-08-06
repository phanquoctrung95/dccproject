(function () {
    'use strict';

    angular
        .module('admin_dashboard', [])
        .factory('adminDashboardServices', adminDashboardServices)
        .controller('adminDashboardCtrl', adminDashboardCtrl);

    //factory
    adminDashboardServices.$inject = ['$http'];
    function adminDashboardServices($http) {
        var factoryDefinitions = {
            getAdminRequestOpenCourse: function () {
                return $http.get('/admin/dashboard/getAdminRequestOpenCourse').success(function (data) {
                    return data;
                });
            },
            getInfoRequestCourseByCourseId: function (request) {
                return $http.post('/admin/dashboard/getInfoRequestCourse', request).success(function (data) {
                    return data;
                });
            },
            getUserRequestedById: function (request) {
                return $http.post('/user/userProfile/getUserById', request).success(function (data) {
                    return data;
                });
            }
        }
        return factoryDefinitions;
    }

    //Controllers
    adminDashboardCtrl.$inject = ['$scope', 'adminDashboardServices', '$rootScope', '$state', '$location', '$stateParams', '$anchorScroll'];
    function adminDashboardCtrl($scope, adminDashboardServices, $rootScope, $state, $location, $stateParams, $anchorScroll) {
        $scope.$on('$locationChangeSuccess', function () {
            if (!!$location.hash()) {
                var flagRequestCanceled = 1;
                //split reference: info[0] is CourseId, info[1] is userId requester
                var info = $location.hash().split("@");
                // get course have requested
                adminDashboardServices.getInfoRequestCourseByCourseId({ courseId: info[0] }).then(function (result) {
                    if (result.data.success) {
                        $scope.RequestCourseNoti = result.data.data;
                        $scope.RequestCourseNoti.traineeList.forEach(userRequest => {
                            // check requested exist requesterList ? because requester can cancel request
                            if (userRequest.id == info[1]) {
                                // get info user request
                                adminDashboardServices.getUserRequestedById({ id: info[1] }).then(function (result) {
                                    $scope.userRequested = result.data.data;
                                    $("#requestNotiModal").modal();
                                });
                                // disable flag request canceled
                                flagRequestCanceled = 0;
                            }
                        });
                    }
                    // if request canceled, show message box noti
                    if (flagRequestCanceled)
                        $rootScope.ShowPopupMessage("Request have been canceled", "error");
                });
                $location.hash('');

            }
        });
        $scope.adminRequestOpenCourseList = [];
        $scope.adminRequestOpenCourseListLimit = [];
        socket.on('updateAdminRequestOpenCourseList', (response) => {
            if (response.message === "update") {
                adminDashboardServices.getAdminRequestOpenCourse().then(function (result) {
                    $scope.adminRequestOpenCourseList = sortByRequests(result.data.data);
                    $scope.adminRequestOpenCourseListLimit = $scope.adminRequestOpenCourseListLimit.concat($scope.adminRequestOpenCourseList.slice(0, 3));
                });
            }
        });
       
        $scope.LoadMoreadminRequestOpenCourseList = function () {
            var limit = $scope.adminRequestOpenCourseList.length;
            var begin = $scope.adminRequestOpenCourseListLimit.length;
            var end = $scope.adminRequestOpenCourseListLimit.length + 4;
            if (end > limit) {
                end = limit;
            }
            $scope.adminRequestOpenCourseListLimit = [...$scope.adminRequestOpenCourseListLimit, ...$scope.adminRequestOpenCourseList.slice(begin, end)];
        }
        $scope.LoadDefaultadminRequestOpenCourseList = function () {
            $scope.adminRequestOpenCourseListLimit = [];
            $scope.adminRequestOpenCourseListLimit = $scope.adminRequestOpenCourseListLimit.concat($scope.adminRequestOpenCourseList).slice(0, 3);
        }

        adminDashboardServices.getAdminRequestOpenCourse().then(function (result) {
            $scope.adminRequestOpenCourseList = sortByRequests(result.data.data);
            setTimeout(() => {
                $anchorScroll($location.hash());
                effectFocus($location.hash());
            }, 0);

        });
    }

    // function sort courses by number request (decrease)
    function sortByRequests(requestOpenCourseList) {
        var byRequest = requestOpenCourseList.slice(0);
        byRequest.sort(function (item_1, item_2) {
            return item_2.numberOfRequest - item_1.numberOfRequest;
        });
        return byRequest;
    }
    function effectFocus(link) {
        var id = document.getElementById(link);
        if (id) {
            id.style.transition = "all .5s";
            var count = 0;
            id.style.background = "#ccc";
            var effect = setInterval(function () {
                if (count % 2 === 0) {
                    id.style.background = "white";
                    count++;
                } else if (count % 2 !== 0) {
                    id.style.background = "#ccc";
                    count++;
                }
                if (count > 2) {
                    clearInterval(effect);
                }
            }, 600);
        }
    }

})();
