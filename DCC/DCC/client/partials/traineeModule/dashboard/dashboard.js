(function () {
    'use strict';

    angular.module('trainee_dashboard', [
        'ui.calendar', 'ui.bootstrap', 'infinite-scroll'
    ])
        .factory('dashboardServices', dashboardServices)
        .directive('fileUpload', fileUpload)
        .controller('MyCoursesCtrl', MyCoursesCtrl)
        .controller('requestOpenCourseCtrl', requestOpenCourseCtrl)
        .controller('viewNotificationCtrl', viewNotificationCtrl);

    function fileUpload() {
        return {
            scope: true,        //create a new scope
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var files = event.target.files;
                    //iterate files since 'multiple' may be specified on the element
                    for (var i = 0; i < files.length; i++) {
                        //emit event upward
                        scope.$emit("fileSelected", { file: files[i] });
                    }
                });
            }
        };
    }
    dashboardServices.$inject = ['$http'];

    function dashboardServices($http) {
        var factoryDefinitions = {
            getClassesThisWeek: function (req) {
                return $http.post('/trainee/dashboard/getClassesThisWeek', req).success(function (data) {
                    return data;
                })
            },
            // getClassesLearned: function (req) {
            //     return $http.post('/trainee/dashboard/getClassesLearned', req).success(function (data) {
            //         return data;
            //     });
            // },
            getMyTraingPrograms: function (req) {
                return $http.post('/trainee/dashboard/getTrainingProgramByTPType', req).success(function (data) {
                    return data;
                });
            },
            getClassesNeedToFeedBack: function (nameTrainingProgram, tranieeId) {
                return $http.post('/trainee/dashboard/getClassesNeedToFeedBack', nameTrainingProgram, tranieeId).success(function (data) {
                    return data;
                });
            },
            getRequestOpenCourse: function (req) {
                return $http.post('/trainee/dashboard/getRequestOpenCourse', req).success(function (data) {
                    return data;
                });
            },
            deleteRequestOpenCourse: function (req) {
                return $http.post('/trainee/courseRegister/deleteRequestOpening', req).success(function (data) {
                    return data;
                });
            },
            updateClassRecordStatus: function (req) {
                return $http.post('/trainee/courseRegister/updateClassRecordStatus', req).success(function (data) {
                    return data;
                });
            },
            unEnrollCourse: function (req) {
                var warn = "Are you sure you want to do this ?";
                if (!confirm(warn)) {
                    exit();
                }
                return $http.post('/trainee/courseRegister/unEnrollCourse', req).success(function (data) {
                    return data;
                });
            },
            sendRegisterRequest: function (request) {
                return $http.post('/trainee/courseRegister/sendRegisterRequest', request).success(function (data) {
                    return data;
                });
            },
            //feedback
            sendFeedback: function (req) {
                return $http.post('/trainee/feedback/sendFeedback', req).success(function (data) {
                    return data;
                });
            },
            getMyFeedbackByClass: function (classId) {
                return $http.post('/trainee/feedback/getMyFeedbackByClass', classId).success(function (data) {
                    return data;
                });
            },
            getEnrolledCourseList: function (userId) {
                return $http.post('trainee/viewSchedule/getEnrolledCourseList', userId).success(function (data) {
                    return data;
                });
            },
            getOtherEnrolledCourseList: function (userId) {
                return $http.post('trainee/viewSchedule/getOtherEnrolledCourseList', userId).success(function (data) {
                    return data;
                });
            },
            getAllEnrolledCourseList: function () {
                return $http.get('trainee/viewSchedule/getAllEnrolledCourseList').success(function (data) {
                    return data;
                });
            },
            enrollClass: function (classId, userId) {
                return $http.post('trainee/dashboard/enrollClass', classId, userId).success(function (data) {
                    return data;
                });
            },
            getInfoNotificationByClassId: function (request) {
                return $http.post('trainee/dashboard/getInfoNotificationByClassId', request).success(function (data) {
                    return data;
                });
            },
            downloadCalendar: function (request) {
                return $http.get('trainee/viewSchedule/downloadCalendar', request).success(function (data) {
                    return data;
                });
            },
            //high Demand Courses
            getDemandOpenCourse: function () {
                return $http.get('/trainee/dashboard/getDemandOpenCourse').success(function (data) {
                    return data;
                });
            },
            uploadFileToUrl: function (file, uploadUrl, classId, userId) {
                var fd = new FormData();
                fd.append('file', file);
                return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'classId': classId,
                        'userId': userId

                    }
                });
            },
            getClassRecordByClassID: function (classId) {
                return $http.post('common/classrecord/getClassRecordByClassID', { classID: classId }).success(function (data) {
                    //console.log(data.data);
                    return data;
                });
            },
            getNumberofNewNotifications: function (userId) {
                return $http
                    .post('/notification/notification/getNumberofNewNotification', userId)
                    .success(function (data) {
                        return data;
                    });
            },
            addNotification: function (req) {
                return $http.post('/notification/notification/addNotification', req).success(function (data) {
                    return data;
                });
            }
        }

        return factoryDefinitions;
    }

    var temporaryClassID;
    MyCoursesCtrl.$inject = ['$scope', 'dashboardServices', '$rootScope', '$state', '$location', '$anchorScroll'];

    function MyCoursesCtrl($scope, dashboardServices, $rootScope, $state, $location, $anchorScroll) {
        const STATUS_ENROLLED = 'Enrolled';
        const STATUS_LEARNED = 'Learned';
        const STATUS_NOT_LEARNED = 'Not Learned';
        const STATUS_NOT_LEARNED_NOT_OPEN = 'Not Learned ';

        //Init action text of button base on status of a course
        $scope.actionOneText = {};
        $scope.actionTwoText = {};
        $scope.actionOneText[STATUS_LEARNED] = 'Give/Edit feedback';
        $scope.actionTwoText[STATUS_LEARNED] = 'Re-enroll';
        $scope.actionOneText[STATUS_ENROLLED] = 'View Schedule';
        $scope.actionTwoText[STATUS_ENROLLED] = 'Un-enroll';
        $scope.actionOneText[STATUS_NOT_LEARNED] = 'Enroll';
        $scope.actionOneText[STATUS_NOT_LEARNED_NOT_OPEN] = 'Request Class';
        $scope.myAllClass = [];
        $scope.myAllClassIncomClosed = [];
        $scope.myAllClassLimit = [];
        $scope.myTrainingProgramList = [];
        $scope.myTrainingProgramListLimit = [];
        $scope.myClassID = [];
        // $scope.myClassesLearned = [];
        // $scope.myClassesLearnedLimit = [];
        $scope.DemandOpenCourseList = [];
        $scope.DemandOpenCourseListLimit = [];
        $scope.myClassNeedToFeedBack = [];
        $scope.myClassNeedToFeedBackLimit = [];
        $scope.myRequestOpenCourseList = [];
        $scope.myRequestOpenCourseListLimit = [];
        $rootScope.lengthOfFeedback;
        $scope.classWithinThisWeekCurrentTime = new Date().toISOString();
        // get classes need to feedback
        dashboardServices.getClassesNeedToFeedBack({
            trainingProgramId: $scope.trainingProgramId,
            traineeId: $rootScope.userInfo.id
        }).then(function (result) {
            $scope.myClassNeedToFeedBack = result.data.data;
            $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;
            $scope.myClassNeedToFeedBackLimit = $scope.myClassNeedToFeedBackLimit.concat($scope.myClassNeedToFeedBack).slice(0, 3);
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
                    dashboardServices
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
                    dashboardServices.getNumberofNewNotifications({ userId: $rootScope.userInfo.id }).then(function (NewNotification) { // update number of noti
                        if (NewNotification) {
                            $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                        }

                    });
                })
                    .catch(function () {
                        //ignore
                    })
            }
        });

        $scope.LoadMoreClassesNeedToFeedBack = function () {
            var limit = $scope.myClassNeedToFeedBack.length;
            var begin = $scope.myClassNeedToFeedBackLimit.length;
            var end = $scope.myClassNeedToFeedBackLimit.length + 3;
            if (end > limit) {
                end = limit;
            }
            $scope.myClassNeedToFeedBackLimit = [...$scope.myClassNeedToFeedBackLimit, ...$scope.myClassNeedToFeedBack.slice(begin, end)];
        }

        $scope.LoadDefaultClassesNeedToFeedBack = function () {
            $scope.myClassNeedToFeedBackLimit = [];
            // get classes need to feedback
            dashboardServices.getClassesNeedToFeedBack({
                trainingProgramId: $scope.trainingProgramId,
                traineeId: $rootScope.userInfo.id
            }).then(function (result) {
                $scope.myClassNeedToFeedBack = result.data.data;
                $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;
                $scope.myClassNeedToFeedBackLimit = $scope.myClassNeedToFeedBackLimit.concat($scope.myClassNeedToFeedBack).slice(0, 3);
            });

            // $scope.myClassNeedToFeedBackLimit = [];   
            // $scope.myClassNeedToFeedBackLimit = $scope.myClassNeedToFeedBackLimit.concat($scope.myClassNeedToFeedBack).slice(0, 3);
        }
        // get demand classes
        dashboardServices.getDemandOpenCourse().then(function (result) {
            $scope.DemandOpenCourseList = sortByRequestForDemand(result.data.data);
            $scope.DemandOpenCourseListLimit = $scope.DemandOpenCourseListLimit.concat($scope.DemandOpenCourseList.slice(0, 3));
        });
        $scope.LoadMoreDemandOpenCourse = function () {
            var limit = $scope.DemandOpenCourseList.length;
            var begin = $scope.DemandOpenCourseListLimit.length;
            var end = $scope.DemandOpenCourseListLimit.length + 4;
            if (end > limit) {
                end = limit;
            }
            $scope.DemandOpenCourseListLimit = [...$scope.DemandOpenCourseListLimit, ...$scope.DemandOpenCourseList.slice(begin, end)];
        }
        $scope.LoadDefaultDemandOpenCourse = function () {
            $scope.DemandOpenCourseListLimit = [];
            $scope.DemandOpenCourseListLimit = $scope.DemandOpenCourseListLimit.concat($scope.DemandOpenCourseList).slice(0, 3);
        }
        //get classes within this week
        dashboardServices.getClassesThisWeek({
            traineeId: $rootScope.userInfo.id
            // status: 'Enrolled'
            /*email: $rootScope.userInfo.email,
            userType: $rootScope.userInfo.userType,
            isExperienced: $rootScope.userInfo.isExperienced*/
        }).then(function (result) {
            $scope.myAllClass = sortByStartTimeForClass(result.data.allCourse);
            $scope.myAllClassIncomClosed = sortByEndTimeForClass(result.data.allCourse);
            $scope.myAllClassLimit = $scope.myAllClassLimit.concat($scope.myAllClassIncomClosed).slice(0, 2);
        });

        // get number class need prepare
        $scope.getNumberClassNeedPrepare = function (classList) {
            var count_ClassToPrepare = 0;
            classList.forEach(classToPrepare => {
                if (classToPrepare.documents != null)
                    count_ClassToPrepare++;
            });
            return count_ClassToPrepare;
        }

        // get path documents from database
        $scope.getPathDocuments = function (myCourse) {
            var paths = [];
            if (myCourse.documents != null) {
                paths = myCourse.documents.split(' ');
                return paths;
            }
            return "";
        }

        // get file name from path
        $scope.getFileName = function (path) {
            if (path != null)
                return path.match(/[-_\w]+[.][\w]+$/i)[0];
            return "";
        }

        $scope.LoadMoreClass = function () {
            var limit = $scope.myAllClassIncomClosed.length;
            var begin = $scope.myAllClassLimit.length;
            var end = $scope.myAllClassLimit.length + 3;
            if (end > limit) {
                end = limit;
            }
            $scope.myAllClassLimit = [...$scope.myAllClassLimit, ...$scope.myAllClassIncomClosed.slice(begin, end)];
        }

        $scope.LoadDefaultClass = function () {
            $scope.myAllClassLimit = [];
            $scope.myAllClassLimit = $scope.myAllClassLimit.concat($scope.myAllClassIncomClosed).slice(0, 2);
        }

        $scope.LoadDefaultClassPrepare = function () {
            $scope.myAllClassLimit = [];
            $scope.myAllClassLimit = $scope.myAllClassLimit.concat($scope.myAllClassIncomClosed).slice(0, 3);
        }

        // //get classes Learned
        // dashboardServices.getClassesLearned({
        //     traineeId: $rootScope.userInfo.id,
        //     status: 'Enrolled'
        //     /*email: $rootScope.userInfo.email,
        //     userType: $rootScope.userInfo.userType,
        //     isExperienced: $rootScope.userInfo.isExperienced*/
        // }).then(function (result) {
        //     $scope.myClassesLearned = result.data.allCourse;
        //     $scope.myClassesLearnedLimit = $scope.myClassesLearnedLimit.concat($scope.myClassesLearned).slice(0,3);
        // });
        // $scope.LoadMoremyClassesLearned = function() {
        //     var limit = $scope.myClassesLearned.length;
        //     var begin = $scope.myClassesLearnedLimit.length;
        //     var end = $scope.myClassesLearnedLimit.length+4;
        //     if (end > limit)
        //     {
        //         end = limit;
        //     }
        //     $scope.myClassesLearnedLimit = [...$scope.myClassesLearnedLimit, ... $scope.myClassesLearned.slice(begin,end)];
        // }
        // $scope.LoadDefaultClassLearned = function() {
        //     $scope.myClassesLearnedLimit = [];
        //     $scope.myClassesLearnedLimit = $scope.myClassesLearnedLimit.concat($scope.myClassesLearned).slice(0,3);
        // }
        //get all courses and training programs - REFRESH
        dashboardServices.getMyTraingPrograms({
            traineeId: $rootScope.userInfo.id,
            email: $rootScope.userInfo.email,
            userType: $rootScope.userInfo.userType,
            isExperienced: $rootScope.userInfo.isExperienced
        }).then(function (result) {
            result.data.trainingProgram.forEach(trainingProgram => {
                if (trainingProgram.Courses.length === 0) {
                    trainingProgram.completePercent = 0;
                } else {
                    trainingProgram.count = 0;
                    trainingProgram.Courses.forEach(course => {
                        if (course.Classes.length !== 0) {
                            //Default
                            course.backgroundColor = '#ff704d';
                            course.status = 'Not Learned ';
                            for (var i = 0; i < course.Classes.length; i++) {
                                if (course.Classes[i].ClassRecords.length === 0) {
                                    if ((Date.parse(course.Classes[i].startTime) > Date.now())) {
                                        course.backgroundColor = '#ffb84d';
                                        course.status = 'Not Learned';
                                    } else {
                                        course.backgroundColor = '#ff704d';
                                        course.status = 'Not Learned ';
                                    }
                                } else {
                                    for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                        if (course.Classes[i].ClassRecords[j].traineeId === $rootScope.userInfo.id) {
                                            course.classId = course.Classes[i].ClassRecords[j].classId;
                                            course.status = course.Classes[i].ClassRecords[j].status;
                                        }
                                    }
                                    if (course.status === STATUS_ENROLLED) {
                                        course.Classes.forEach(classes => {
                                            var today = new Date();
                                            if (Date.parse(classes.endTime) < Date.parse(today)) {
                                                classes.ClassRecords.forEach(classRecord => {
                                                    if (classRecord.confirmJoin != 'NO')
                                                        dashboardServices.updateClassRecordStatus(classRecord)
                                                });
                                                course.backgroundColor = '#8BC34A';
                                            } else course.backgroundColor = '#4FC3F7';
                                        });
                                    } else if (course.status === STATUS_LEARNED) {
                                        course.backgroundColor = '#8BC34A';
                                        trainingProgram.count = trainingProgram.count + 1;
                                        break;
                                    } else {
                                        if ((Date.parse(course.Classes[i].startTime) > Date.now())) {
                                            course.backgroundColor = '#ffb84d';
                                            course.status = 'Not Learned';
                                        } else {
                                            course.backgroundColor = '#ff704d';
                                            course.status = 'Not Learned ';
                                        }
                                    }
                                }
                            }
                        } else {
                            course.backgroundColor = '#ff704d';
                            course.status = 'Not Learned ';
                        }
                    });
                    trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
                }
            });
            $scope.myTrainingProgramList = result.data.trainingProgram;
            $scope.myTrainingProgramListLimit = $scope.myTrainingProgramListLimit.concat($scope.myTrainingProgramList.slice(0, 3));
        });

        $scope.LoadMoreMyTrainingPrograms = function () {
            var limit = $scope.myTrainingProgramList.length;
            var begin = $scope.myTrainingProgramListLimit.length;
            var end = $scope.myTrainingProgramListLimit.length + 4;
            if (end > limit) {
                end = limit;
            }
            $scope.myTrainingProgramListLimit = [...$scope.myTrainingProgramListLimit, ...$scope.myTrainingProgramList.slice(begin, end)];
        }

        $scope.LoadDefaultMyTrainingPrograms = function () {
            $scope.myTrainingProgramListLimit = [];
            $scope.myTrainingProgramListLimit = $scope.myTrainingProgramListLimit.concat($scope.myTrainingProgramList).slice(0, 3);
        }
        //Save files when upload
        //a simple model to bind to and send to the server
        $scope.model = {
            name: "",
            comments: ""
        };
        //an array of files selected
        $scope.files = [];
        //listen for the file selected event
        $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });
        $scope.submitExercise = function (classUpload) {
            var file = $scope.files[0];
            var uploadUrl = "/trainee/dashboard/saveFileUpload";
            var userId = $rootScope.userInfo.id;
            var classId = classUpload.id;
            dashboardServices.uploadFileToUrl(file, uploadUrl, classId, userId).then((res) => {
                if (res.data.success) {
                    $rootScope.ShowPopupMessage("Submit Exercises Successful", "success");
                } else {
                    $rootScope.ShowPopupMessage("Submit Exercises Failed", "error");
                }
            }, (err) => {
                $rootScope.ShowPopupMessage("Submit Exercises Failed", "error");
            });
        }

        // un-Enroll or re-Enroll Course
        $scope.actionTwoClick = function (myCourse) {
            if (myCourse.status === STATUS_ENROLLED) {
                //un-enroll
                dashboardServices.unEnrollCourse({
                    traineeId: $rootScope.userInfo.id,
                    classId: myCourse.classId
                }).then(function (result) {
                    if (result.data.success) {
                        //REFRESH
                        dashboardServices.getMyTraingPrograms({
                            traineeId: $rootScope.userInfo.id,
                            email: $rootScope.userInfo.email,
                            userType: $rootScope.userInfo.userType,
                            isExperienced: $rootScope.userInfo.isExperienced
                        }).then(function (result) {
                            result.data.trainingProgram.forEach(trainingProgram => {
                                if (trainingProgram.Courses.length === 0) {
                                    trainingProgram.completePercent = 0;
                                } else {
                                    trainingProgram.count = 0;

                                    trainingProgram.Courses.forEach(course => {
                                        if (course.Classes.length !== 0) {
                                            for (var i = 0; i < course.Classes.length; i++) {
                                                if (course.Classes[i].ClassRecords.length === 0) {
                                                    course.backgroundColor = '#ffb84d';
                                                    course.status = 'Not Learned';
                                                } else {
                                                    for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                                        if (course.Classes[i].ClassRecords[j].traineeId === $rootScope.userInfo.id) {
                                                            course.classId = course.Classes[i].ClassRecords[j].classId;
                                                            course.status = course.Classes[i].ClassRecords[j].status;
                                                        }
                                                    }
                                                    if (course.status === STATUS_ENROLLED) {
                                                        course.backgroundColor = '#4FC3F7'
                                                    } else if (course.status === STATUS_LEARNED) {
                                                        course.backgroundColor = '#8BC34A';
                                                        trainingProgram.count = trainingProgram.count + 1;
                                                        break;
                                                    } else {
                                                        course.backgroundColor = '#ffb84d';
                                                        course.status = 'Not Learned';
                                                    }
                                                }
                                            }
                                        } else {
                                            course.backgroundColor = '#ffb84d';
                                            course.status = 'Not Learned';
                                        }
                                    });
                                    trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
                                }
                            });
                            $scope.myTrainingProgramList = result.data.trainingProgram;
                        });
                        //--END OF REFRESH
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                    } else {
                        $rootScope.ShowPopupMessage(result.data.msg, "error");
                    }
                });
            } else if (myCourse.status === STATUS_LEARNED) {
                //re-Enroll: function same function request Opening
                dashboardServices.sendRegisterRequest({
                    userId: $rootScope.userInfo.id,
                    courseId: myCourse.id,
                    username: $rootScope.userInfo.username
                }).then(function (result) {
                    if (result.data.success) {
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                        //REFRESH
                        dashboardServices.getMyTraingPrograms({
                            traineeId: $rootScope.userInfo.id,
                            email: $rootScope.userInfo.email,
                            userType: $rootScope.userInfo.userType,
                            isExperienced: $rootScope.userInfo.isExperienced
                        }).then(function (result) {
                            result.data.trainingProgram.forEach(trainingProgram => {
                                if (trainingProgram.Courses.length === 0) {
                                    trainingProgram.completePercent = 0;
                                } else {
                                    trainingProgram.count = 0;

                                    trainingProgram.Courses.forEach(course => {
                                        if (course.Classes.length !== 0) {
                                            for (var i = 0; i < course.Classes.length; i++) {
                                                if (course.Classes[i].ClassRecords.length === 0) {
                                                    course.backgroundColor = '#ffb84d';
                                                    course.status = 'Not Learned';
                                                } else {
                                                    for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                                        if (course.Classes[i].ClassRecords[j].traineeId === $rootScope.userInfo.id) {
                                                            course.classId = course.Classes[i].ClassRecords[j].classId;
                                                            course.status = course.Classes[i].ClassRecords[j].status;
                                                        }
                                                    }
                                                    if (course.status === STATUS_ENROLLED) {
                                                        course.backgroundColor = '#4FC3F7'
                                                    } else if (course.status === STATUS_LEARNED) {
                                                        course.backgroundColor = '#8BC34A';
                                                        trainingProgram.count = trainingProgram.count + 1;
                                                        break;
                                                    } else {
                                                        course.backgroundColor = '#ffb84d';
                                                        course.status = 'Not Learned';
                                                    }
                                                }
                                            }
                                        } else {
                                            course.backgroundColor = '#ffb84d';
                                            course.status = 'Not Learned';
                                        }
                                    });
                                    trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
                                }
                            });
                            $scope.myTrainingProgramList = result.data.trainingProgram;
                        });
                        //--END OF REFRESH
                    } else {
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                    }
                });
            }
        };
        //Give feedback or View Schedule function
        $scope.hoveringOver = function (value) {
            $rootScope.overStar = value;
        };

        $scope.actionOneClick = function (myCourse) {
            // show feedback modal
            $('#feedbackModal').modal('show');
            temporaryClassID = myCourse.classId;
            myCourse.traineeId = $rootScope.userInfo.id;
            $scope.$watchGroup(['courseFeedbackModel.happy_rating', 'courseFeedbackModel.content_rating', 'courseFeedbackModel.trainer_rating'], function (newValue, oldValue) {
                if (newValue[0] > 0 && newValue[1] > 0 && newValue[2] > 0) {
                    $rootScope.feedBackbtn = false;
                }
                else {
                    $rootScope.feedBackbtn = true;
                }
            })
            dashboardServices.getMyFeedbackByClass(myCourse).then(function (result) {
                $rootScope.courseFeedbackModel = result.data.feedback;
                if ($rootScope.courseFeedbackModel.trainer_rating === "0" &&
                    $rootScope.courseFeedbackModel.improve_comments === "" &&
                    $rootScope.courseFeedbackModel.trainer_rating === "0" &&
                    $rootScope.courseFeedbackModel.happy_rating === "0") {
                    $rootScope.feedbackBtn = "Send feedback";
                    $rootScope.isDeleteFeedbackBtn = true;
                }
                else {
                    $rootScope.feedbackBtn = "Update feedback";
                    $rootScope.isDeleteFeedbackBtn = false;
                }
            });
        };
        // <button type="submit" class="btn btn-danger" ng-click="giveFeedbackClick(courseFeedbackModel)" data-dismiss="modal">Send Feedback</button>

        $scope.btnApplyDate = function (feedbackModel) {
            feedbackModel.traineeId = $rootScope.userInfo.id;
            feedbackModel.classId = temporaryClassID;
            dashboardServices.sendFeedback(feedbackModel).then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage("Rating success", "success");
                    if ($rootScope.feedbackBtn == "Send feedback") //chỉ send feedback thì mới trừ
                        $rootScope.lengthOfFeedback -= 1;
                } else {
                    $rootScope.ShowPopupMessage("Rating fail", "error");
                    $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;

                }
            });

        }

        $scope.ensureFeedback = function () {
            $('#feedbackModal12').modal('show');
        }
        // $scope.giveFeedbackClick = function (feedbackModel) {
        //     $('#feedbackModal12').modal('show');
        //     feedbackModel.traineeId = $rootScope.userInfo.id;
        //     feedbackModel.classId = temporaryClassID;
        //     console.log("AAAAAAAAA");
        //     console.log(feedbackModel.traineeId);
        //     console.log(feedbackModel.classId);
        //     dashboardServices.sendFeedback(feedbackModel).then(function (result) {
        //         if (result.data.success) {
        //             $rootScope.ShowPopupMessage("Rating success", "success");
        //             if ($rootScope.feedbackBtn == "Send feedback") //chỉ send feedback thì mới trừ
        //                 $rootScope.lengthOfFeedback -= 1;
        //         } else {
        //             $rootScope.ShowPopupMessage("Rating fail", "error");
        //             $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;
        //         }
        //     });

        // };

        $scope.deleteFeedbackClick = function () {
            var emptyFeedback = {
                traineeId: $rootScope.userInfo.id,
                classId: temporaryClassID,
                trainer_rating: 0,
                improve_comments: "",
                content_rating: 0,
                happy_rating: 0
            };
            dashboardServices.sendFeedback(emptyFeedback).then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage("Delete success", "success");
                    $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;
                } else {
                    $rootScope.ShowPopupMessage("Delete fail", "error");
                    $rootScope.lengthOfFeedback = $scope.myClassNeedToFeedBack.length;
                }
            });
        };
    }

    //Request Open Course controller
    requestOpenCourseCtrl.$inject = ['$scope', 'dashboardServices', '$rootScope', '$state'];

    function requestOpenCourseCtrl($scope, dashboardServices, $rootScope, $state) {
        dashboardServices.getRequestOpenCourse({
            userId: $rootScope.userInfo.id
        }).then(function (result) {
            $scope.myRequestOpenCourseList = result.data.data;
            $scope.myRequestOpenCourseListLimit = $scope.myRequestOpenCourseListLimit.concat($scope.myRequestOpenCourseList).slice(0, 3);
            $scope.myRequestOpenCourseList.forEach(course => {
                course.haveClass = false;
                if (course.Classes.length &&
                    Date.parse(course.Classes[course.Classes.length - 1].startTime) > Date.parse(Date(Date.now()))) {
                    course.haveClass = true;
                }
            })
        });

        socket.on('updateRequestOpenCourse', (response) => {
            if (response.message === "update") {
                dashboardServices.getRequestOpenCourse({
                    userId: $rootScope.userInfo.id
                }).then(function (result) {
                    $scope.myRequestOpenCourseList = result.data.data;
                    $scope.myRequestOpenCourseListLimit = $scope.myRequestOpenCourseListLimit.concat($scope.myRequestOpenCourseList).slice(0, 3);
                    $scope.myRequestOpenCourseList.forEach(course => {
                        course.haveClass = false;
                        if (course.Classes.length &&
                            Date.parse(course.Classes[course.Classes.length - 1].startTime) > Date.parse(Date(Date.now()))) {
                            course.haveClass = true;
                        }
                    })
                });
            }
        });
        $scope.LoadMoreRequest = function () {
            var limit = $scope.myRequestOpenCourseList.length;
            var begin = $scope.myRequestOpenCourseListLimit.length;
            var end = $scope.myRequestOpenCourseListLimit.length + 4;
            if (end > limit) {
                end = limit;
            }
            $scope.myRequestOpenCourseListLimit = [...$scope.myRequestOpenCourseListLimit, ...$scope.myRequestOpenCourseList.slice(begin, end)];
        }

        $scope.LoadDefaultRequest = function () {
            $scope.myRequestOpenCourseListLimit = [];
            $scope.myRequestOpenCourseListLimit = $scope.myRequestOpenCourseListLimit.concat($scope.myRequestOpenCourseList).slice(0, 3);
        }

        $scope.checkDate = function (startTime) {
            return Date.parse(startTime) > Date.parse(Date(Date.now())) ? true : false;
        }

        $scope.enrollClassClick = function (classID, requestOpenCourseId) {
            dashboardServices.enrollClass({
                classId: classID,
                userId: $rootScope.userInfo.id
            }).then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage("Enroll class successfully", "success");
                    dashboardServices.deleteRequestOpenCourse({
                        courseId: requestOpenCourseId,
                        userId: $rootScope.userInfo.id
                    });
                    dashboardServices.getRequestOpenCourse({
                        userId: $rootScope.userInfo.id
                    }).then(function (result) {
                        $scope.myRequestOpenCourseList = result.data.data;
                    });
                    $state.go("courseDetail", {
                        courseId: requestOpenCourseId
                    });
                } else {
                    $rootScope.ShowPopupMessage("Fail to Enroll Class", "error");
                }
            })
        }
        $scope.showConfirmCancelModal = function (course) {
            $rootScope.courseId = course.id;
            $rootScope.contentConfirm = "Are you sure to cancel request " + course.name + " course ?"
        };
        $scope.cancelRequestClick = function (requestOpenCourseId) {
            dashboardServices.deleteRequestOpenCourse({
                courseId: requestOpenCourseId,
                userId: $rootScope.userInfo.id
            }).then(function (result) {
                if (result.data.success) {
                    //refesh the request open course list
                    dashboardServices.getRequestOpenCourse({
                        userId: $rootScope.userInfo.id
                    }).then(function (result) {
                        $scope.myRequestOpenCourseList = result.data.data;
                        $scope.myRequestOpenCourseListLimit = $scope.myRequestOpenCourseList.slice(0, 3);
                    });
                    $rootScope.ShowPopupMessage("Cancel Request successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Cancel Request", "error");
                }
            });
        };
    }

    viewNotificationCtrl.$inject = ['$scope', 'dashboardServices', '$rootScope', '$compile', '$filter', '$location', '$anchorScroll'];

    function viewNotificationCtrl($scope, dashboardServices, $rootScope, $compile, $filter, $location, $anchorScroll) {
        $scope.$on('$locationChangeSuccess', function () {
            $scope.haveNotification = !!$location.hash();
            if (!!$location.hash()) {
                $scope.classId = $location.hash();
                dashboardServices.getInfoNotificationByClassId({
                    classId: $scope.classId
                }).then((response) => {

                    if (response.data.success && response.data.data) {

                        $scope.infoNotification = {};
                        $scope.infoNotification.id = response.data.data.Classes[0].id;
                        $scope.infoNotification.name = response.data.data.name;
                        $scope.infoNotification.endTime = response.data.data.Classes[0].endTime;
                        $scope.infoNotification.startTime = response.data.data.Classes[0].startTime;
                        $scope.infoNotification.trainer = response.data.data.Classes[0].User.username;
                        $scope.infoNotification.location = response.data.data.Classes[0].location;
                        $scope.infoNotification.description = response.data.data.description;
                        $scope.infoNotification.courseId = response.data.data.id;
                        setTimeout(() => {
                            $anchorScroll($scope.infoNotification.id);
                            effectFocus($scope.infoNotification.id);
                        }, 0);
                    }
                });
            }
        });
    }
    // sort all class by start time (increase)
    function sortByStartTimeForClass(myClassList) {
        var classList = myClassList.slice(0);
        classList.sort(function (class_1, class_2) {
            var startTime1 = new Date(class_1.startTime);
            var startTime2 = new Date(class_2.startTime);
            return startTime1 - startTime2;
        });
        return classList;
    }

    // sort all class by end time (declease)
    function sortByEndTimeForClass(myClassList) {
        var classList = myClassList.slice(0);
        classList.sort(function (class_1, class_2) {
            var endTime1 = new Date(class_1.endTime);
            var endTime2 = new Date(class_2.endTime);
            return endTime2 - endTime1;
        });
        return classList;
    }

    // sort demand high by number request (decrease)
    function sortByRequestForDemand(demandOpenCourseList) {
        var demandList = demandOpenCourseList.slice(0);
        demandList.sort(function (request_1, request_2) {
            return request_2.numberOfRequest - request_1.numberOfRequest;
        });
        return demandList;
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
