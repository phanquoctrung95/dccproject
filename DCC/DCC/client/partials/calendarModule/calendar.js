'use strict';


(function () {
    'use strict';

    angular
        .module('calendarModule', ['ui.calendar', 'ui.bootstrap'])
        .controller('calendarController', calendarController)
        .controller('modifiedCalendarController', modifiedCalendarController)
    
    calendarController.$inject = ['$scope', 'dashboardServices', '$rootScope', '$compile', '$filter', '$sce', '$timeout', 'uiCalendarConfig'];

    async function calendarController($scope, dashboardServices, $rootScope, $compile, $filter, $sce, $timeout, uiCalendarConfig) {
        $scope.personalEvent = [];
        $scope.globalEvent = [];
        $scope.attendeeList = [{
            id: '##',
            username: "#noName",
            email: '#noEmail',
            status: 'No'
        }];
        $scope.placement = {
            selected: 'left'
        };
        $scope.dynamicPopover = {
            title: 'Your Calendar URL'
        };

        var updateListAttendee = async (classID, cb) => {
            // $scope.attendeeList = [];
            var list = [];
            await dashboardServices.getClassRecordByClassID(classID).then((result) => {
                result.data.data.forEach( (user,i) => {
                    var obj = {
                        id: i+1,
                        username: user.username,
                        email: user.email,
                        status: user.confirmJoin === null ? 'YES' : user.confirmJoin
                    };
                    list.push(obj);
                });
            });
           
            $scope.$applyAsync(() => {
                $scope.attendeeList = list;
                cb();
            });
        };
        // filter show calendar
        // if 1 show all class have had
        // if 0 show all class of this user
        $scope.showAll = 1;
        $scope.titleFilterButton = "Show Personal";
        $scope.events = [];

        $scope.htmlPopover = $sce.trustAsHtml('<div class="form-group"><input type="text" class="form-control" value="webcal://192.168.122.20/calendar/event.ics" readonly/></div>');

        $scope.eventsF;
        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: []
        };

        $scope.eventSources = [$scope.events];

        if ($rootScope.userInfo) {
            //Get enrolled course list
            var resultEnrolledCourseList = await dashboardServices
                .getEnrolledCourseList({
                    userId: $rootScope.userInfo.id
                });
            var enrolledCourseList = resultEnrolledCourseList.data.data;

            angular.forEach(enrolledCourseList, function (value) {
                const element = {
                    classId: value.id,
                    mine: true,
                    title: value.title,
                    description: value.description,
                    start: new Date(value.start),
                    end: new Date(value.end),
                    location: value.location,
                    stick: true
                }

                $scope.personalEvent.push(element);
                $scope.globalEvent.push(element);
            });

            // Get other course list
            var resultOtherCourseList = await dashboardServices
                .getOtherEnrolledCourseList({
                    userId: $rootScope.userInfo.id
                });
            var enrolledOtherCourseList = resultOtherCourseList.data.data;

            angular.forEach(enrolledOtherCourseList, function (value) {
                var checkMutualCourse = $scope.personalEvent.findIndex(function (event) {
                    return event.classId === value.id;
                });

                if (checkMutualCourse === -1) {
                    const element = {
                        classId: value.id,
                        mine: false,
                        title: value.title,
                        description: value.description,
                        start: new Date(value.start),
                        end: new Date(value.end),
                        location: value.location,
                        stick: true
                    }
                    $scope.globalEvent.push(element);
                }
            });
        } else {
            var resultEnrolledAll = await dashboardServices
                .getAllEnrolledCourseList();
            var enrolledAllCourseList = resultEnrolledAll.data.data;
            angular.forEach(enrolledAllCourseList, function (value) {
                const element = {
                    mine: false,
                    title: value.title,
                    description: value.description,
                    start: new Date(value.start),
                    end: new Date(value.end),
                    location: value.location,
                    stick: true
                }
                $scope.events.push(element);
            });
        }


        $timeout(() => {
            for (let i = 0; i < $scope.globalEvent.length; i++) {
                $scope.events.push($scope.globalEvent[i]);
            }

        }, 100);

        $scope.eventRender = (event, element) => {
            element.context.style.textAlign = 'center';

            if (event.mine) {
                element.context.style.backgroundColor = 'red';
                element.context.style.borderColor = 'red';
            }
        }
        // $scope.btnApplyConfirm = function () {
        //    angular.forEach($scope.attendeeList,function(checkbox){
        //        console.log(checkbox);
        //        if(checkbox.selected)
        //        {
        //            console.log(checkbox);
        //        }
        //        else
        //        {
        //            console.log("asd");
        //        }
        //    })
        // }
        // $scope.change = function(id){
        //     console.log("asd")
        //     console.log(id)
            
        //     angular.forEach($scope.attendeeList,function(checkbox){
        //         console.log(checkbox);
        //         if(checkbox.selected)
        //         {
        //             console.log(checkbox);
        //         }
        //         else
        //         {
        //             console.log("asd");
        //         }
        //     })
        // }
        /* show custom event*/
        $scope.filterEvent = function () {
            $scope.titleFilterButton = "Loading...";

            $timeout(() => {
                $scope.removeAllEvent();
                if ($scope.showAll === 1) {
                    // fill personal data to array events
                    for (let i = 0; i < $scope.personalEvent.length; i++) {
                        $scope.events.push($scope.personalEvent[i]);
                    }
                    // click change status
                    // show personal
                    $scope.showAll = 0;
                    $scope.titleFilterButton = "Show All";
                } else {
                    // show all other calendar
                    // fill global data to array events
                    for (let i = 0; i < $scope.globalEvent.length; i++) {
                        $scope.events.push($scope.globalEvent[i]);
                    }
                    // if show personal
                    // click change status to show all
                    $scope.showAll = 1;
                    $scope.titleFilterButton = "Show Personal";
                }
            });
        };
        // remove event
        $scope.removeAllEvent = function () {
            $scope.events.splice(0, $scope.events.length);
        };
        $scope.eventMouseover = function (data) {
            var tooltip = '<div class="tooltiptopicevent" style="color:#ffffff;border-radius:15px;width:aut' +
                'o;height:auto;background:#424242;position:absolute;z-index:10001;padding:10px 10' +
                'px 10px 10px;line-height: 200%;">' + data.title + '</br>Start: ' +
                $filter('date')(new Date(data.start), "h:mm a") + '</br>End: ' +
                $filter('date')(new Date(data.end), "h:mm a") + '</br>Location: ' + data.location + '</div>';

            $("body").append(tooltip);
            $(this).mouseover(function () {
                $(this).css('z-index', 10000);
                $('.tooltiptopicevent').fadeIn('500');
                $('.tooltiptopicevent').fadeTo('10', 1.9);
            })
                .mousemove(function (e) {
                    $('.tooltiptopicevent').css('top', e.pageY + 10);
                    $('.tooltiptopicevent').css('left', e.pageX + 20);
                });

        },
            $scope.eventMouseout = function () {
                $(this).css('z-index', 8);

                $('.tooltiptopicevent').remove();

            },
            $scope.eventResizeStart = function () {
                tooltip.hide()
            },
            $scope.eventDragStart = function () {
                tooltip.hide()
            },
            $scope.viewDisplay = function () {
                tooltip.hide()
            },
            $scope.eventClick = (calEvent, jsEvent, view) => {
                updateListAttendee(calEvent.classId, () => {
                    $('#infoClassAttendee').modal('show');
                });
            }

        $scope.uiConfig = {
            calendar: {
                editable: false, //Not allow to edit events
                displayEventTime: false,
                allDaySlot: false,
                header: {
                    left: 'month agendaWeek',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventRender: $scope.eventRender,
                eventMouseover: $scope.eventMouseover,
                eventMouseout: $scope.eventMouseout,
                eventResizeStart: $scope.eventResizeStart,
                eventDragStart: $scope.eventDragStart,
                viewDisplay: $scope.viewDisplay,
                eventClick: $scope.eventClick
            }

        };
    }

    modifiedCalendarController.$inject = ['$scope', 'dashboardServices', '$rootScope', '$compile', '$filter', '$sce', '$timeout', 'uiCalendarConfig'];

    async function modifiedCalendarController($scope, dashboardServices, $rootScope, $compile, $filter, $sce, $timeout, uiCalendarConfig) {
        $scope.personalEvent = [];
        $scope.globalEvent = [];

        $scope.placement = {
            selected: 'left'
        };
        $scope.dynamicPopover = {
            title: 'Your Calendar URL'

        };

        // filter show calendar
        // if 1 show all class have had
        // if 0 show all class of this user
        $scope.showAll = 1;
        $scope.titleFilterButton = "Show Personal";
        $scope.events = [];
        $scope.timeOfEvents = [];
        var TimeOfFirstEventOfDay = "";

        $scope.htmlPopover = $sce.trustAsHtml('<div class="form-group"><input type="text" class="form-control" value="webcal://192.168.122.20/calendar/event.ics" readonly/></div>');

        $scope.eventsF;
        $scope.calEventsExt = {
            color: '#f00',
            textColor: 'yellow',
            events: []
        };

        $scope.eventSources = [$scope.events];

        if ($rootScope.userInfo) {
            //Get enrolled course list
            var resultEnrolledCourseList = await dashboardServices
                .getEnrolledCourseList({
                    userId: $rootScope.userInfo.id
                });
            var enrolledCourseList = resultEnrolledCourseList.data.data;
            angular.forEach(enrolledCourseList, function (value) {
                const element = {
                    classId: value.id,
                    mine: true,
                    title: value.title + "\nLocation: " + value.location,
                    description: value.description,
                    start: new Date(value.start),
                    end: new Date(value.end),
                    location: value.location,
                    stick: true
                }
                $scope.personalEvent.push(element);
                $scope.globalEvent.push(element);
            });

            // Get other course list
            var resultOtherCourseList = await dashboardServices
                .getOtherEnrolledCourseList({
                    userId: $rootScope.userInfo.id
                });
            var enrolledOtherCourseList = resultOtherCourseList.data.data;

            angular.forEach(enrolledOtherCourseList, function (value) {
                var checkMutualCourse = $scope.personalEvent.findIndex(function (event) {
                    return event.classId === value.id;
                });

                if (checkMutualCourse === -1) {
                    const element = {
                        classId: value.id,
                        mine: false,
                        title: value.title + "\nLocation: " + value.location,
                        description: value.description,
                        start: new Date(value.start),
                        end: new Date(value.end),
                        location: value.location,
                        stick: true
                    }
                    $scope.globalEvent.push(element);
                }
            });
        } else {
            var resultEnrolledAll = await dashboardServices
                .getAllEnrolledCourseList();
            var enrolledAllCourseList = resultEnrolledAll.data.data;
            angular.forEach(enrolledAllCourseList, function (value) {
                const element = {
                    mine: false,
                    title: value.title + "\nLocation: " + value.location,
                    description: value.description,
                    start: new Date(value.start),
                    end: new Date(value.end),
                    location: value.location,
                    stick: true
                }
                $scope.events.push(element);
            });
        }

        //Get The time of fist event of the day
        var d = new Date();
        $scope.modifiedEvent = $scope.globalEvent.filter(item => item.start > d);
        $scope.modifiedEvent.forEach(item => {
            $scope.events.push(item);
        });
        $scope.events.forEach(item => {
            $scope.timeOfEvents.push(item.start);
        });
        $scope.timeOfEvents.sort(function (a, b) { return a.getTime() - b.getTime() });
        if ($scope.timeOfEvents.length > 0) {
            var h = $scope.timeOfEvents[0].getHours();
            var m = $scope.timeOfEvents[0].getMinutes();
            var s = $scope.timeOfEvents[0].getSeconds();
            TimeOfFirstEventOfDay = h + ":" + m + ":" + s;
        } else {
            TimeOfFirstEventOfDay = "14:00:00";
        }

        //Get full date name
        var dateName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        // document.getElementById("date").innerHTML = dateName[d.getDay()]+ " " + day + "/" + month + "/" + year;
        var fullDateName = dateName[d.getDay()] + " " + day + "/" + month + "/" + year;

        // Render events
        $timeout(() => {
            for (let i = 0; i < $scope.globalEvent.length; i++) {
                $scope.events.push($scope.globalEvent[i]);
            }
        }, 100);

        // Render personal events
        $scope.eventRender = (event, element) => {
            element.context.style.fontSize = '14px';
            element.context.style.textAlign = 'center';

            if (event.mine) {
                element.context.style.backgroundColor = 'red';
                element.context.style.borderColor = 'red';
            }
        }

        /* show custom event*/
        $scope.filterEvent = function () {
            $scope.titleFilterButton = "Loading...";

            $timeout(() => {
                $scope.removeAllEvent();
                if ($scope.showAll === 1) {
                    // fill personal data to array events
                    for (let i = 0; i < $scope.personalEvent.length; i++) {
                        $scope.events.push($scope.personalEvent[i]);
                    }
                    // click change status
                    // show personal
                    $scope.showAll = 0;
                    $scope.titleFilterButton = "Show All";
                } else {
                    // show all other calendar
                    // fill global data to array events
                    for (let i = 0; i < $scope.globalEvent.length; i++) {
                        $scope.events.push($scope.globalEvent[i]);
                    }
                    // if show personal
                    // click change status to show all
                    $scope.showAll = 1;
                    $scope.titleFilterButton = "Show Personal";
                }
            });
        };
        // remove event
        $scope.removeAllEvent = function () {
            $scope.events.splice(0, $scope.events.length);
        };

        $scope.eventMouseover = function (data) {
            var tooltip = ' ';

            $("body").append(tooltip);
            $(this).mouseover(function () {
                $(this).css('z-index', 10000);
                $('.tooltiptopicevent').fadeIn('500');
                $('.tooltiptopicevent').fadeTo('10', 1.9);
            })
                .mousemove(function (e) {
                    $('.tooltiptopicevent').css('top', e.pageY + 10);
                    $('.tooltiptopicevent').css('left', e.pageX + 20);
                });

        },
            $scope.eventMouseout = function () {
                $(this).css('z-index', 8);

                $('.tooltiptopicevent').remove();

            },
            $scope.eventResizeStart = function () {
                tooltip.hide()
            },
            $scope.eventDragStart = function () {
                tooltip.hide()
            },
            $scope.viewDisplay = function () {
                tooltip.hide()
            },
            $scope.uiModifiedConfig = {
                calendar: {
                    defaultView: 'agendaDay',
                    viewRender: function (view, element) {
                        element.find('.fc-day-header').html(fullDateName);
                    },
                    height: 512,
                    editable: false, //Not allow to edit events
                    displayEventTime: false,
                    header: false,
                    allDaySlot: false,
                    minTime: "06:00:00",
                    maxTime: "21:00:00",
                    scrollTime: TimeOfFirstEventOfDay,
                    eventRender: $scope.eventRender,
                    eventMouseover: $scope.eventMouseover,
                    eventMouseout: $scope.eventMouseout,
                    eventResizeStart: $scope.eventResizeStart,
                    eventDragStart: $scope.eventDragStart,
                    viewDisplay: $scope.viewDisplay
                }
            };
    }

})();
