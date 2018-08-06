(function () {
    'use strict';
    angular
        .module('admin_classAdding', ['textAngular', 'courseDetail'])
        .factory('classManagementServices', classManagementServices)
        .controller('admin_classAdding', classAdding)
        .controller('DateTimepickerCtrl', DateTimepickerCtrl);

    //Factory
    classManagementServices.$inject = ['$http'];

    function classManagementServices($http) {
        var factoryDefinitions = {
            getCourseTypeList: function () {
                return $http.get('/admin/courses/getCourseTypeList').success(function (data) {
                    return data;
                });
            },
            //Training Program
            getTrainingProgramList: function () {
                return $http.get('/admin/courses/getTrainingProgramList').success(function (data) {
                    return data;
                });
            },
            updateTrainingProgram: function (trainingProgram) {
                return $http.post('/admin/courses/updateTrainingProgram', trainingProgram).success(function (data) {
                    return data;
                });
            },
            //Class
            getClass: function (courseId) {
                return $http.post('/admin/courses/getClass', courseId).success(function (data) {
                    return data;
                });
            },
            addClass: function (Class) {
                return $http.post('/admin/courses/addClass', Class).success(function (data) {
                    return data;
                });
            },
            getTrainerList: function () {
                return $http.get('/admin/courses/getAllTrainer').success(function (data) {
                    return data;
                });
            },
            getgroupNameList: function () {
                return $http.post('/group/group/getgroupName').success(function (data) {
                    return data;
                });
            },
            getLocationList: function () {

            }
        }
        return factoryDefinitions;
    }
    DateTimepickerCtrl.$inject = ['$scope', '$rootScope', '$state'];

    function DateTimepickerCtrl($scope, $rootScope, $state) {
        if ($state.$current.name != 'OpeningClass') {
            $scope.$watch('adminClassModel.timeOfStart', function (newVal, oldVal) {
                var getHoursStartTime = $rootScope.adminClassModel.timeOfStart.getHours();// lay gia tri cua Start time
                $rootScope.timeOfEnd = new Date(); // khoi tao gia tri moi
                $rootScope.timeOfEnd.setHours(getHoursStartTime + 1); // end time = start time + 1
                $rootScope.timeOfEnd.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes()); //set minutes bang nhau
                $rootScope.adminClassModel.timeOfEnd = $rootScope.timeOfEnd; // day cho client
            });
            $scope.update = function () {
                var getHoursStartTime = $rootScope.adminClassModel.timeOfStart.getHours();
                $rootScope.timeOfEnd = new Date();
                $rootScope.timeOfEnd.setHours(getHoursStartTime);
                $rootScope.timeOfEnd.setMinutes(0);
                $rootScope.adminClassModel.timeOfEnd = $rootScope.timeOfEnd;
            }
        }
        //time picker
        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.ismeridian = false;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };
        $rootScope.mousewheel = false;
        //DatePicker
        $rootScope.dayOfStart = '';
        $scope.today = function () {
            $rootScope.dayOfStart = new Date();
        };

        $scope.clear = function () {
            $rootScope.dayOfStart = null;
        };

        $scope.inlineOptions = {
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };
    }


    var countKeyIncrement = 0;
    classAdding.$inject = ['$scope', '$rootScope', 'classManagementServices', 'courseDetailServices', '$location', '$stateParams', 'userServices', 'dashboardServices'];

    function classAdding($scope, $rootScope, classManagementServices, courseDetailServices, $location, $stateParams, userServices) {
        $scope.listUsers = [];
        $scope.listgroups = [];
        $scope.arrayTime = [];
        // laays duwx lieeuj treen. suwr dungj userServices owr file client\partials\users\users.js
        userServices.getAllUsers().success(data => {
            $scope.listUsers = data.data;
        });
        
        // courseManagementServices.getgroupNameList().success(data =>{
        //     console.log("AAA");
        //     console.log(data.data);
        //     $scope.listgroups = data.data;
        // })


        $scope.$watch('adminClassModel.groupId', function (res, req) {
            // bat dau goi api
            var arr = [];
            if (res != null) {
                arr = [];
                for (var i = 0, lengthOfRes = res.length; i < lengthOfRes; i++) {
                    arr.push(res[i].groupID);
                }
                arr = JSON.stringify(arr);
                var arr = "(" + arr.slice(1, -1) + ")";
                if (arr != "()") {
                    userServices.getAllUserDontLearnByGroupID({ groupID: arr }).success(data => {
                        $rootScope.adminClassModel.specificAttendant = data.data;
                    })
                }
                else
                    $rootScope.adminClassModel.specificAttendant = [];
            }
        }, true);

        $scope.loadUsers = function (query) {
            return $scope.listUsers.filter((user) => {
                return user.email.indexOf(query) > -1;
            });
        };

        $scope.loadGroups = function (query) {
            return $scope.listgroups.filter((groupName) => {         
                return groupName.groupName.indexOf(query) > -1;
            });
        };
        // This here I process Add time in your Class

        $scope.locationList = ["1L-Earth",
            "1S-Moon",
            "1S-Sun",
            "2L-Venus",
            "2S-Jupiter",
            "2S-Saturn",
            "3L-Mercury",
            "3S-Mars",
            "4S-Ferrari",
            "4S-Mercedes",
            "4S-Redbull",
            "4S-Williams",
            "7L-Neptune"
        ];
        $rootScope.addEditFormIsEditForm = false;
        //Class
        $rootScope.addEditClassFormTitle = 'Add Class';
        $rootScope.addEditClassFormAction = 'Add';
        //date and time
        $rootScope.timeOfStart = new Date();
        $rootScope.timeOfStart.setHours(10);
        $rootScope.timeOfStart.setMinutes(0);
        $rootScope.dayOfStart = new Date();
        $rootScope.timeOfEnd = new Date();
        $rootScope.timeOfEnd.setHours(12);
        $rootScope.timeOfEnd.setMinutes(0);
        $rootScope.dayOfEnd = new Date();
        $rootScope.adminClassModel = {
            dayOfStart: $rootScope.dayOfStart,
            timeOfStart: $rootScope.timeOfStart,
            dayOfEnd: $rootScope.dayOfEnd,
            timeOfEnd: $rootScope.timeOfEnd,
            courseId: null,
            location: '',
            trainerId: '',
            startTime: $rootScope.dateTimePicker,
            endTime: $rootScope.endTimePicker,
            arrayClassTime: [],
            maxAttendant: null,
        };

        //get training program
        classManagementServices.getTrainingProgramList().then(function (result) {
            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
        });
        $rootScope.$watch('adminClassModel.location', function () { });
        // trainer
        classManagementServices.getTrainerList().then(function (result) {
            $scope.trainerList = result.data.trainer;
        });
        //group
        classManagementServices.getgroupNameList().then(function (result) {
            $scope.groupnNameList = result.data.data;
            for (var i = 0; i < result.data.data.length; i++) {
                $scope.listgroups[i] = result.data.data[i];
            }
        });
        $scope.isDuplicateTime = function (objTime, startTime, endTime) {
            return (Date.parse(objTime.endtime) == Date.parse(endTime)) ||
                (Date.parse(objTime.starttime) == Date.parse(startTime));
        }
        $scope.isHaveClass = function (objTime, startTime) {
            return (Date.parse(objTime.endtime) >= Date.parse(startTime)) &&
                (Date.parse(objTime.starttime) <= Date.parse(startTime));
        };
        $scope.isCollapseClass = function (objTime, startTime, endTime) {
            return (Date.parse(objTime.endtime) >= Date.parse(endTime)) &&
                (Date.parse(objTime.starttime) <= Date.parse(endTime));
        }
        $scope.isNotSuitableTime = function (objTime) {
            return (Date.parse(objTime.endtime) <= (Date.parse(objTime.starttime)));
        }
        //click Addtime
        $scope.myClickHere = function () {
            checkingTime();
        }

        function checkingTime() {
            $rootScope.dateTimePicker = $rootScope.adminClassModel.dayOfStart;
            $rootScope.dateTimePicker.setHours($rootScope.adminClassModel.timeOfStart.getHours());

            $rootScope.dateTimePicker.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
            var dayOfStartTime = new Date();
            // set start Time
            dayOfStartTime.setFullYear($rootScope.adminClassModel.dayOfStart.getFullYear());
            dayOfStartTime.setMonth($rootScope.adminClassModel.dayOfStart.getMonth());
            dayOfStartTime.setDate($rootScope.adminClassModel.dayOfStart.getDate());
            dayOfStartTime.setHours($rootScope.adminClassModel.timeOfStart.getHours());
            dayOfStartTime.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
            var startTime = dayOfStartTime;

            $rootScope.endTimePicker = $rootScope.adminClassModel.dayOfStart;
            $rootScope.endTimePicker.setHours($rootScope.adminClassModel.timeOfEnd.getHours());
            $rootScope.endTimePicker.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());

            var dayOfEndTime = new Date();
            // set end Time
            dayOfEndTime.setFullYear($rootScope.adminClassModel.dayOfStart.getFullYear());
            dayOfEndTime.setMonth($rootScope.adminClassModel.dayOfStart.getMonth());
            dayOfEndTime.setDate($rootScope.adminClassModel.dayOfStart.getDate());
            dayOfEndTime.setHours($rootScope.adminClassModel.timeOfEnd.getHours());
            dayOfEndTime.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());
            var endTime = dayOfEndTime;
            var flagAddTime = 0;
            if (Date.now() >= Date.parse(startTime) ||
                Date.parse(startTime) >= Date.parse(endTime)) {
                flagAddTime = -1;
            } else {
                for (var i = 0; i < $scope.arrayTime.length; i++) {
                    if ($scope.isNotSuitableTime($scope.arrayTime[i]) ||
                        $scope.isHaveClass($scope.arrayTime[i], startTime) ||
                        $scope.isDuplicateTime($scope.arrayTime[i], startTime, endTime) ||
                        $scope.isCollapseClass($scope.arrayTime[i], startTime, endTime)
                    ) {
                        flagAddTime = -1;
                    } else {
                        break;
                    }
                }
            }

            if (flagAddTime == 0) {
                $scope.arrayTime.push({
                    starttime: startTime,
                    endtime: endTime
                });
                document.getElementById('infor_error_addtime').innerHTML = "";
                return 1; // return 1 if correct time
            } else {
                document.getElementById('infor_error_addtime').innerHTML = "Your time can't be added";
                return 0;
            }
        }
        $scope.myClickDelete = function (index) {
            // Because index of array in the key so I use key delete array by splice key: countKeyIncrement++,
            var indexs = -1;
            for (let i = 0; i < $scope.arrayTime.length; i++) {
                if ($scope.arrayTime[i].key === index) {
                    indexs = i;
                    break;
                }
            }
            $scope.arrayTime.splice(indexs, 1);
            countKeyIncrement--;
            document.getElementById('infor_error_addtime').innerHTML = "";
        }
        $scope.refreshArrayTime = function () {
            $scope.arrayTime = [];
            document.getElementById('infor_error_addtime').innerHTML = "";
        }

        $scope.closeDialog = function () {
            $scope.arrayTime = [];
            document.getElementById('infor_error_addtime').innerHTML = "";
        }
        //Class
        $scope.addEditClassClick = function () {
            var hoursTimeStart = $rootScope.adminClassModel.timeOfStart.getHours();
            var minutesTimeStart = $rootScope.adminClassModel.timeOfStart.getMinutes();
            var hoursEndStart = $rootScope.adminClassModel.timeOfEnd.getHours();
            var minutesEndStart = $rootScope.adminClassModel.timeOfEnd.getMinutes();
            document.getElementById('infor_error_addtime').innerHTML = "";
            if (hoursTimeStart > hoursEndStart || (hoursTimeStart == hoursEndStart && minutesTimeStart >= minutesEndStart)) {
                $rootScope.ShowPopupMessage("Your class can't be added", "error");
                document.getElementById('infor_error_addtime').innerHTML = "Your time can't be added";
                return;
            }
            // add array class time in adminClassModel
            $rootScope.adminClassModel.arrayClassTime = $scope.arrayTime;
            if ($rootScope.addEditFormIsEditForm) {
                $rootScope.dateTimePicker = new Date(Date.parse($rootScope.adminClassModel.dayOfStart));
                $rootScope.dateTimePicker.setHours($rootScope.adminClassModel.timeOfStart.getHours());
                $rootScope.dateTimePicker.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
                $rootScope.adminClassModel.startTime = $rootScope.dateTimePicker;
                $rootScope.endTimePicker = new Date(Date.parse($rootScope.adminClassModel.dayOfStart));
                $rootScope.endTimePicker.setHours($rootScope.adminClassModel.timeOfEnd.getHours());
                $rootScope.endTimePicker.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());
                $rootScope.adminClassModel.endTime = $rootScope.endTimePicker;

            } else {
                //add Class
                $rootScope.dateTimePicker = new Date(Date.parse($rootScope.adminClassModel.dayOfStart));
                $rootScope.dateTimePicker.setHours($rootScope.adminClassModel.timeOfStart.getHours());
                $rootScope.dateTimePicker.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
                $rootScope.adminClassModel.startTime = $rootScope.dateTimePicker;
                $rootScope.endTimePicker = new Date(Date.parse($rootScope.adminClassModel.dayOfStart));
                $rootScope.endTimePicker.setHours($rootScope.adminClassModel.timeOfEnd.getHours());

                $rootScope.endTimePicker.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());
                $rootScope.adminClassModel.endTime = $rootScope.endTimePicker;

                if ($scope.arrayTime.length === 0) {
                    $scope.arrayTime.push({
                        starttime: $rootScope.adminClassModel.startTime,
                        endtime: $rootScope.adminClassModel.endTime
                    });
                }

                courseDetailServices.addClass($rootScope.adminClassModel).then(function (result) {
                    if (result.data.success) {
                        //Get Class List
                        courseDetailServices.getClassByCourseID($rootScope.adminClassModel.courseId, 'ASC').then(function (result) {
                            $rootScope.classList = result.data.data;
                        });
                        $rootScope.ShowPopupMessage("Add Class Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Your class can't be added", "error");
                    }
                });
                $scope.arrayTime = [];
            }
        };
    }

})();
