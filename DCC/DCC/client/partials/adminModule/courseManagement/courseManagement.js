(function () {
    'use strict';
    angular
        .module('admin_courseManagement', ['textAngular', 'courseDetail'])
        .factory('courseManagementServices', courseManagementServices)
        .controller('courseManagementCtrl', courseManagementCtrl)
        .controller('addEditCourseCtrl', addEditCourseCtrl)
        .controller('addEditTPCtrl', addEditTPCtrl)
        .controller('deleteCtrl', deleteCtrl)
        .controller('addEditClassCtrl', addEditClassCtrl)

    //Factory
    courseManagementServices.$inject = ['$http'];
    function courseManagementServices($http) {
        var factoryDefinitions = {
            getCourseTypeList: function () {
                return $http.get('/admin/courses/getCourseTypeList').success(function (data) {
                    return data;
                });
            },
            //Course
            addCourse: function (course) {
                return $http.post('/admin/courses/addCourse', course).success(function (data) {
                    return data;
                });
            },
            updateCourse: function (course) {
                return $http.post('/admin/courses/updateCourse', course).success(function (data) {
                    return data;
                });
            },
            deleteCourse: function (courseId) {
                return $http.post('/admin/courses/deleteCourse', courseId).success(function (data) {
                    return data;
                });
            },
            //Training Program
            getTrainingProgramList: function () {
                return $http.get('/admin/courses/getTrainingProgramList').success(function (data) {
                    return data;
                });
            },
            addTrainingProgram: function (trainingProgram) {
                return $http.post('/admin/courses/addTrainingProgram', trainingProgram).success(function (data) {
                    return data;
                });
            },
            updateTrainingProgram: function (trainingProgram) {
                return $http.post('/admin/courses/updateTrainingProgram', trainingProgram).success(function (data) {
                    return data;
                });
            },
            deleteTrainingProgram: function (trainingProgram) {
                return $http.post('/admin/courses/deleteTrainingProgram', trainingProgram).success(function (data) {
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
            updateClass: function (Class) {
                return $http.post('/admin/courses/updateTrainingProgram', Class).success(function (data) {
                    return data;
                });
            },
            deleteClass: function (Class) {
                return $http.post('/admin/courses/deleteClass', Class).success(function (data) {
                    return data;
                });
            },
            getTrainerList: function () {
                return $http.get('/admin/courses/getAllTrainer').success(function (data) {
                    return data;
                });
            },
            getLocationList: function () {

            }
        }
        return factoryDefinitions;
    }

    //controller
    courseManagementCtrl.$inject = ['$sce', '$scope', '$rootScope', 'courseManagementServices', '$location'];
    function courseManagementCtrl($sce, $scope, $rootScope, courseManagementServices) {
        $rootScope.getTrainerList = function () {
            courseManagementServices.getTrainerList().then(function (result) {
                $rootScope.trainerList = result.data.trainer;
            });
        }
        //GetTrainingProgram
        $rootScope.adminTrainingProgramList = [];
        $rootScope.adminTrainingProgramListLimit = [];

        courseManagementServices.getTrainingProgramList().then(function (result) {
            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
            $rootScope.adminTrainingProgramListLimit = $rootScope.adminTrainingProgramListLimit.concat($rootScope.adminTrainingProgramList.slice(0,3));
        });

        $rootScope.LoadMoreTrainingProgram = function() {
            var limit = $rootScope.adminTrainingProgramList.length;
            var begin = $rootScope.adminTrainingProgramListLimit.length;
            var end = $rootScope.adminTrainingProgramListLimit.length+4;
            if (end > limit)
            {
                end = limit;
            }
            $rootScope.adminTrainingProgramListLimit = [...$rootScope.adminTrainingProgramListLimit, ...$rootScope.adminTrainingProgramList.slice(begin,end)];
        }

        $rootScope.LoadDefaultTrainingProgram = function() {
            $rootScope.adminTrainingProgramListLimit = [];
            $rootScope.adminTrainingProgramListLimit = $rootScope.adminTrainingProgramListLimit.concat($rootScope.adminTrainingProgramList.slice(0,3));
        }
        //dislay modal of edit & add course, trainning program or class
        $scope.showAddCourseForm = function (trainingProgram) {
            $rootScope.addEditFormIsEditForm = false;
            //course
            $rootScope.addEditCourseFormTitle = 'Add Course';
            $rootScope.addEditCourseFormAction = 'Add';
            $rootScope.courseModel = {
                name: '',
                description: '',
                duration: '',
                documents: '',
                test: '',
                trainingProgramId: trainingProgram.id
            };
        };
        $scope.showAddTPForm = function () {
            $rootScope.addEditFormIsEditForm = false;
            // trainingProgram
            $rootScope.addEditTPFormTitle = 'Add Training Program';
            $rootScope.addEditTPFormAction = 'Add';
            $rootScope.adminTrainingProgramModel = {
                name: '',
                description: '',
                courseTypeId: {
                    id: ''
                }
            };
        };
        $scope.showUpdateCourseForm = function (trainingProgram, course) {
            $rootScope.addEditFormIsEditForm = true;
            //course
            $rootScope.addEditCourseFormTitle = 'Edit Course';
            $rootScope.addEditCourseFormAction = 'Update';
            $rootScope.courseModel = {
                id: course.id,
                name: course.name,
                description: course.description,
                duration: course.duration,
                documents: course.documents,
                test: course.test,
                // trainerId: adminclass.trainerId,
                trainingProgramId: trainingProgram.id
            };
        };
        $scope.showUpdateTPForm = function (trainingProgram) {
            $rootScope.addEditFormIsEditForm = true;
            //trainingProgram
            $rootScope.addEditTPFormTitle = 'Edit Training Program';
            $rootScope.addEditTPFormAction = 'Update Training Program';
            $rootScope.adminTrainingProgramModel = {
                id: trainingProgram.id,
                name: trainingProgram.name,
                description: trainingProgram.description,
                courseTypeId: {
                    id: trainingProgram.courseTypeId
                }
            };
        };
        $scope.showDeleteCourseForm = function (course) {
            $rootScope.deleteClickId = 1;
            $rootScope.flagDelete = (course.Classes.length === 0);
            if ($rootScope.flagDelete) {
                $rootScope.deleteName = "Are you sure to delete " + course.name + ' course';
                $rootScope.courseModel = {
                    id: course.id,
                };
            } else {
                $rootScope.deleteName = "Fail to Delete " + course.name + " Course Because of Existing Class";
            }
            //course

        };
        $scope.showDeleteTPForm = function (trainingProgram) {
            $rootScope.deleteClickId = 2;
            $rootScope.flagDelete = true;
            $rootScope.flagDelete = (trainingProgram.Courses.length === 0);
            //training Program
            if ($rootScope.flagDelete) {
                $rootScope.deleteName = "Are you sure to delete " + trainingProgram.name + ' training program';
                $rootScope.adminTrainingProgramModel = {
                    id: trainingProgram.id,
                };
            } else {
                $rootScope.deleteName = "Fail to Delete " + trainingProgram.name + " Program Because of Existing Course";
            }

        };
        $scope.showAddFastClassForm = function () {
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
        };
        $scope.showAddClassForm = function (course) {
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
                courseId: course.id,
                location: '',
                trainerId: '',
                startTime: $rootScope.dateTimePicker,
                endTime: $rootScope.endTimePicker,
                arrayClassTime: [],
                maxAttendant: null,
            };
        };

        $scope.findCourse = function (courseSearchKey) {
            if ((courseSearchKey !== 'r') && (courseSearchKey !== 'p') && (courseSearchKey !== '<') && (courseSearchKey !== '>')) {
                var courseListSearchResult = []
                $rootScope.adminTrainingProgramList.forEach(trainingProgram => {
                    trainingProgram.Courses.forEach(course => {
                        if ((course.name.toUpperCase().indexOf(courseSearchKey.toUpperCase()) !== -1) ||
                            (course.description.toUpperCase().indexOf(courseSearchKey.toUpperCase()) !== -1)) {
                            courseListSearchResult.push(course);
                        }
                    });
                });
            }
            $scope.courseListSearchResult = courseListSearchResult;
        };
        $scope.highlight = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        };
    }

    //Add and Edit Course Control
    addEditCourseCtrl.$inject = ['$scope', '$rootScope', 'courseManagementServices', '$location'];
    function addEditCourseCtrl($scope, $rootScope, courseManagementServices) {
        //get TrainingProgram
        courseManagementServices.getTrainingProgramList().then(function (result) {
            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
        });
        $scope.addEditCourseClick = function () {
            if ($rootScope.addEditFormIsEditForm) {
                //edit course
                courseManagementServices.updateCourse($rootScope.courseModel).then(function (result) {
                    if (result.data.success) {
                        //GetTrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Edit Course Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Edit Course", "error");
                    }
                });
            } else {
                //add course
                courseManagementServices.addCourse($rootScope.courseModel).then(function (result) {
                    if (result.data.success) {
                        //GetTrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Add Course Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Add Course", "error");
                    }
                });
            }
        };
    }

    //Add and Edit Training Program Control
    addEditTPCtrl.$inject = ['$scope', '$rootScope', 'courseManagementServices', '$location'];
    function addEditTPCtrl($scope, $rootScope, courseManagementServices) {
        //getCourseTypeList
        courseManagementServices.getCourseTypeList().then(function (result) {
            $scope.courseTypeList = result.data.courseType;
        });
        $scope.addEditTPClick = function () {
            if ($rootScope.addEditFormIsEditForm) {
                //edit trainning program
                courseManagementServices.updateTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                    if (result.data.success) {
                        //GetTrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Edit Training Program Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage('Fail to Edit Training Program !', "error");
                    }
                });
            }
            else {
                //add trainning program
                courseManagementServices.addTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                    if (result.data.success) {
                        //GetTrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Add Training Program Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage('Fail to Add Training Program', "error");
                    }
                });
            }
        };
    }

    //deletel Course, Class, Training program
    deleteCtrl.$inject = ['$scope', '$rootScope', 'courseManagementServices', '$location'];
    function deleteCtrl($scope, $rootScope, courseManagementServices) {
        $scope.deleteClick = function () {
            if ($rootScope.deleteClickId === 1) {
                //delete course
                courseManagementServices.deleteCourse($rootScope.courseModel).then(function (result) {
                    if (result.data.success) {
                        //get TrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Delete Course Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Delete Course Because of Existing Classes", "error");
                    }
                });
            } else if ($rootScope.deleteClickId === 2) {
                //delete TP
                courseManagementServices.deleteTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                    if (result.data.success) {
                        //get TrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Delete Training Program Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Delete Training Program Because of Exist Courses", "error");
                    }
                });
            } else if ($rootScope.deleteClickId === 3) {
                //delete Class
                courseManagementServices.deleteClass($rootScope.adminClassModel).then(function (result) {
                    if (result.data.success) {
                        //get TrainingProgram
                        courseManagementServices.getTrainingProgramList().then(function (result) {
                            $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                        });
                        $rootScope.ShowPopupMessage("Delete Class Successfully", "success");
                    } else {
                        $rootScope.ShowPopupMessage("Fail to Delete Class", "error");
                    }
                });
            }
        };
    }

    var countKeyIncrement = 0;
    addEditClassCtrl.$inject = ['$scope', '$rootScope', 'courseManagementServices', 'courseDetailServices', '$location', '$stateParams', 'userServices', 'dashboardServices'];
    function addEditClassCtrl($scope, $rootScope, courseManagementServices, courseDetailServices, $location, $stateParams, userServices) {
        $scope.listUsers = [];
        $scope.arrayTime = [];

        $("#addEditClassModal").on('hidden.bs.modal', function () {
            $scope.arrayTime = [];
            document.getElementById('infor_error_addtime').innerHTML = "";

        });

        userServices.getAllUsers().success(data => {
            $scope.listUsers = data.data;
        });
        $scope.loadUsers = function (query) {
            return $scope.listUsers.filter((user) => {
                return user.email.indexOf(query) > -1;
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
        $rootScope.$watch('adminClassModel.location', function () {});
        // trainer
        courseManagementServices.getTrainerList().then(function (result) {
            $scope.trainerList = result.data.trainer;
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
        $scope.myClickHere = function () {
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
            } else {
                document.getElementById('infor_error_addtime').innerHTML = "Your time can't be added";
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
