(function () {
    'use strict';

    angular.module('courseDetail', [

    ])
        .factory('courseDetailServices', courseDetailServices)
        .controller('courseDetailCtrl', courseDetailCtrl)
        .controller('DateTimepickerCtrl', DateTimepickerCtrl)
        .controller('myChartCtrl', myChartCtrl);
    //Factories
    courseDetailServices.$inject = ['$http'];

    function courseDetailServices($http) {
        var factoryDefinitions = {
            getCourseDetailById: function (courseId) {
                return $http.post('/common/course/getCourseDetail', {
                    courseId: courseId
                }).success(function (data) {
                    return data;
                });
            },

            getUserByCourseID: function (courseId) {
                return $http.post('/common/course/getRequesterByCourseID', {
                    courseId: courseId
                }).success(function (data) {
                    return data;
                });
            },
            getClassByCourseID: function (courseId, order) {
                return $http.post('/common/course/getClassByCourseID', {
                    courseId: courseId,
                    order: order
                }).success(function (data) {
                    return data;
                });
            },
            addClass: function (Class) {
                return $http.post('/admin/courses/addClass', Class).success(function (data) {
                    return data;
                });
            },
            editClass: function (Class) {
                return $http.post('/admin/courses/editClass', Class).success(function (data) {
                    return data;
                });
            },
            updateClass: function (Class) {
                return $http.post('/admin/courses/updateClass', Class).success(function (data) {
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
            getTeamNameList: function () {
                return $http.get('/team/team/getTeamName').success(function (data) {
                    return data;
                });
            },
            getClassByCourseIDbyYear: function (courseId, year) {
                return $http.post('/common/class/getClassByCourseIDbyYear', {
                    courseId: courseId,
                }).success(function (data) {
                    return data;
                });
            },
            getClassByCourseIDbyMonth: function (courseId) {
                return $http.post('/common/class/getClassByCourseIDbyMonth', {
                    courseId: courseId,

                }).success(function (data) {
                    return data;
                });
            },
            getClassByCourseIDbyWeek: function (courseId) {
                return $http.post('/common/class/getClassByCourseIDbyWeek', {
                    courseId: courseId,

                }).success(function (data) {
                    return data;
                });
            },

        }

        return factoryDefinitions;
    }

    //Controllers
    courseDetailCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'courseDetailServices'];

    function courseDetailCtrl($scope, $rootScope, $stateParams, courseDetailServices) {

        // declare variable courseDetail
        $scope.courseDetail = {};
        // save currID for next refresh
        sessionStorage.setItem("currentCourseDetailID", $stateParams.courseId || sessionStorage.getItem("currentCourseDetailID"));
        var courseId = $stateParams.courseId || sessionStorage.getItem("currentCourseDetailID");

        courseDetailServices.getCourseDetailById(courseId).then(function (result) {
            $scope.courseDetail = result.data.data;
        });


        $rootScope.classList = {};

        courseDetailServices.getClassByCourseID(courseId, 'ASC').then(function (result) {
            $rootScope.classList = result.data.data;
        });

        $rootScope.userRequestList = {};

        courseDetailServices.getUserByCourseID(courseId).then(function (result) {
            $rootScope.userRequestList = result.data.data;
        })
        //Rating
        $scope.rate = 1;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
        };
        //Class
        $scope.showAddClassForm = function () {
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
                courseId: $stateParams.courseId,
                location: '',
                startTime: $rootScope.dateTimePicker,
                endTime: $rootScope.endTimePicker,
                maxAttendant: null,
            };

        };
        $scope.showUpdateClassForm = function (Class) {
            $rootScope.addEditFormIsEditForm = true;
            $rootScope.addEditClassFormTitle = 'Edit Class';
            $rootScope.addEditClassFormAction = 'Update Class';

            Class.startTime = new Date(Class.startTime);
            $rootScope.dayOfStart = Class.startTime;
            $rootScope.timeOfStart = new Date();
            $rootScope.timeOfStart.setHours(Class.startTime.getHours());
            $rootScope.timeOfStart.setMinutes(Class.startTime.getMinutes());

            Class.endTime = new Date(Class.endTime);
            $rootScope.dayOfEnd = Class.endTime;
            $rootScope.timeOfEnd = new Date();
            $rootScope.timeOfEnd.setHours(Class.endTime.getHours());
            $rootScope.timeOfEnd.setMinutes(Class.endTime.getMinutes());
            $rootScope.location = Class.location;
            $rootScope.adminClassModel = {
                dayOfStart: $rootScope.dayOfStart,
                timeOfStart: $rootScope.timeOfStart,
                dayOfEnd: $rootScope.dayOfEnd,
                timeOfEnd: $rootScope.timeOfEnd,
                id: Class.id,
                trainer: {
                    username: Class.trainerName,
                    id: Class.trainerId
                },
                team: {
                    id: Class.teamID,
                    teamName: Class.teamName,
                },
                maxAttendant: Class.maxAttendant,
                location: Class.location,
                courseId: {
                    id: Class.courseId
                }
            };
        };
        $rootScope.classDelete;
        $scope.sendDeleteClass = function (Class) {
            $rootScope.classDelete = Class;
        }

        $scope.DeleteClass = function () {
            var Class = $rootScope.classDelete;
            Class.courseName = $scope.courseDetail.name;
            courseDetailServices.deleteClass(Class).then(function (result) {
                if (result.data.success) {
                    courseDetailServices.getClassByCourseID(Class.courseId, 'ASC').then(function (result) {
                        $rootScope.classList = result.data.data;
                    });
                    $rootScope.ShowPopupMessage("Delete Class Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage('Fail to Delete Class!', "error");
                }

            });
        };
    }

    myChartCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'courseDetailServices'];
    function myChartCtrl($scope, $rootScope, $stateParams, courseDetailServices) {
        sessionStorage.setItem("currentCourseDetailID", $stateParams.courseId || sessionStorage.getItem("currentCourseDetailID"));
        var courseId = $stateParams.courseId || sessionStorage.getItem("currentCourseDetailID");
        $scope.courseDetail.filter = 'This Month';
        var averageHappyRating = [];
        var averageTrainerRating = [];
        var averageContentRating = [];
        var myChart;
        var labels;
        var trainerName = [];
        var time = [];
        $scope.averageRating = 0;
        function addData(chart, label, data) {
            chart.data.labels = label;
            chart.data.datasets = data;
            chart.update();
        }

        function removeData(chart) {
            chart.data.labels = [];
            chart.data.datasets.forEach((dataset) => {
                dataset.data = [];
            });
            chart.update();
        }
        var allAverageRating = [0, 0, 0];
        var updateDataChart = (result) => {
            removeData(myChart);
            labels = Array.apply(null, { length: result.data.data.length }).map(function (value, index) {
                return index + 1;
            });
            averageHappyRating = [];
            averageTrainerRating = [];
            averageContentRating = [];

            allAverageRating = [0, 0, 0];
            var allAverageContentRating = 0;
            var allAverageTrainerRating = 0;
            var numOfFeedback = 0;
            time = [];
            trainerName = [];
            result.data.data.forEach(element => {
                time.push(moment(element.startTime).format("LLL"));
                trainerName.push(element.trainerName);
                averageContentRating.push(element.content_ratingAverage);
                averageTrainerRating.push(element.trainer_ratingAverage);
                averageHappyRating.push(element.happy_ratingAverage);
                if (element.content_ratingAverage != "NaN") {
                    allAverageRating[2] += parseFloat(element.content_ratingAverage);
                    allAverageRating[0] += parseFloat(element.happy_ratingAverage);
                    allAverageRating[1] += parseFloat(element.trainer_ratingAverage);
                    numOfFeedback++;
                }
            });
            //Tính trung bình đánh giá
            allAverageRating[0] = allAverageRating[0] / numOfFeedback;
            allAverageRating[1] = allAverageRating[1] / numOfFeedback;
            allAverageRating[2] = allAverageRating[2] / numOfFeedback;

            $scope.averageRating = ((allAverageRating[0] + allAverageRating[1] + allAverageRating[2]) / 3).toFixed(2);
            var data = [{
                label: 'Happy Average Rating',
                data: averageHappyRating,
                borderColor: "#66ff33",
                backgroundColor: "#66ff33",
                fill: false,
            },
            {
                label: 'Trainer Average Rating',
                data: averageTrainerRating,
                borderColor: "#0961ef",
                backgroundColor: "#0961ef",
                fill: false,
            },
            {
                label: 'Content Average Rating',
                data: averageContentRating,
                borderColor: "#f2041c",
                backgroundColor: "#f2041c",
                fill: false
            }];
            addData(myChart, labels, data);
        }
        var updateAverageRating = (ci) => {
            var sumAverageLineNotHidden = 0;
            var numOfLineNoHidden = 0;
            for (let i = 0; i < 3; i++) {
                if (ci.getDatasetMeta(i).hidden === true) { } else {
                    sumAverageLineNotHidden += parseFloat(allAverageRating[i]);
                    numOfLineNoHidden++;
                }
            }
            $scope.$apply(() => {
                $scope.averageRating = (sumAverageLineNotHidden / numOfLineNoHidden).toFixed(2);
            });
        }
        var ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            options: {
                spanGaps: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            stepSize: 0.5,
                            max: 5
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Ratings',
                            // fontSize: 16
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Class',
                            // fontSize: 16
                        }
                    }]
                },
                responsive: true,
                tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            var infoPoint = [tooltipItems.yLabel];
                            infoPoint[0] = "Average rating: " + infoPoint[0];
                            infoPoint.push('Trainer: ' + trainerName[tooltipItems.xLabel - 1]);
                            infoPoint.push('Time: ' + time[tooltipItems.xLabel - 1]);
                            return infoPoint;
                        },
                        title: function (tooltipItems, data) {
                            return 'Class: ' + tooltipItems[0].xLabel;
                        },
                    }
                },
                legend: {
                    onClick: function (e, legendItem) {
                        var index = legendItem.datasetIndex;
                        var ci = this.chart;
                        var meta = ci.getDatasetMeta(index);
                        // See controller.isDatasetVisible comment
                        meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                        // We hid a dataset ... rerender the chart
                        ci.update();
                        updateAverageRating(ci);
                    }
                },
            }
        })
        $scope.dataSelectChart = [
            { data: 'All', id: 1 },
            { data: 'By Year', id: 2 },
            { data: 'By Month', id: 3 },
            { data: 'By Week', id: 4 },
            {
                data: 'By Day', id: 5
            }];
        $scope.$watch('selectChart', function (newVal) {
            switch (newVal.data) {
                case "All": {
                    courseDetailServices.getClassByCourseID(courseId, 'ASC').then(function (result) {
                        updateDataChart(result);
                    });
                    break;
                }
                case "By Year": {
                    courseDetailServices.getClassByCourseIDbyYear(courseId).then(function (result) {
                        updateDataChart(result);
                    });
                    break;
                }
                case "By Month":
                    courseDetailServices.getClassByCourseIDbyMonth(courseId).then(function (result) {
                        updateDataChart(result);
                    });
                    break;
                case "By Week":
                    courseDetailServices.getClassByCourseIDbyWeek(courseId).then(function (result) {
                        updateDataChart(result);
                    });
                    break;
                case 'By Day':
                    $('#dateTimePicker').modal({
                        show: 'true'
                    });
                    break;
            }
        });
        $scope.btnApplyDate = function () {
            // get starttime
            var startTime = moment($('#startDate').datepicker('getDate')).toISOString()
            // get endtime
            var endTime = moment($('#endDate').datepicker('getDate')).toISOString()

            removeData(myChart);
            //call api và đỗ dữ liệu vào
            var dataOfClassList = $rootScope.classList;
            //sort by startTime
            dataOfClassList.sort(function(a,b){
                return a.startTime.localeCompare(b.startTime);
            })
            //xử lý 
            averageHappyRating = [];
            averageTrainerRating = [];
            averageContentRating = [];
            time = [];
            trainerName = [];
            dataOfClassList.forEach(element => {
                if (moment(element.startTime).toISOString() >= startTime && moment(element.endTime).toISOString() <= endTime) {
                    time.push(moment(element.startTime).format("LLL"));
                    trainerName.push(element.trainerName);
                    averageContentRating.push(element.content_ratingAverage);
                    averageTrainerRating.push(element.trainer_ratingAverage);
                    averageHappyRating.push(element.happy_ratingAverage);
                }
            });
            labels = Array.apply(null, { length: averageHappyRating.length }).map(function (value, index) {
                return index + 1;
            });

            var data = [{
                label: 'Happy Average Rating',
                data: averageHappyRating,
                borderColor: "#66ff33",
                backgroundColor: "#66ff33",
                fill: false,
            },
            {
                label: 'Trainer Average Rating',
                data: averageTrainerRating,
                borderColor: "#0961ef",
                backgroundColor: "#0961ef",
                fill: false,
            },
            {
                label: 'Content Average Rating',
                data: averageContentRating,
                borderColor: "#f2041c",
                backgroundColor: "#f2041c",
                fill: false
            }];
            addData(myChart, labels, data);
        }

        $('#startDate').datepicker({
            format: 'dd-mm-yyyy',
            endDate: '0d',
            autoclose: true
        }).on("changeDate", function (e) {
            jQuery('#endDate').datepicker("setStartDate", e.date);
        });
        var d = new Date();
        var now = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        $('#startDate').datepicker('update', now);

        $('#endDate').datepicker({
            format: 'dd-mm-yyyy',
            endDate: '0d',
            autoclose: true
        }).on("changeDate", function (e) {
            $('#startDate').datepicker("setEndDate", e.date);
        });
        $('#endDate').datepicker('update', now);
    }
    DateTimepickerCtrl.$inject = ['$scope', '$rootScope', '$stateParams', 'courseDetailServices'];

    function DateTimepickerCtrl($scope, $rootScope) {
        //time picker

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.ismeridian = false;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };

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

})();