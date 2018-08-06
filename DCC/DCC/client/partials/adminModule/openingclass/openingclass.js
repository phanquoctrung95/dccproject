(function () {
    'use strict';

    angular
        .module('openingclass', [])
        .factory('openingclassService', openingclassService)
        .controller('getOpeningClassController', getOpeningClassController);

    openingclassService.$inject = ['$http', 'dashboardServices'];

    function openingclassService($http, dashboardServices) {
        var factoryDefinition = {
            // khai bao ham de thuc hien
            getClassList: function () {
                return $http.get('/admin/courses/getAllClassFullDetail').success(function (data) {
                    return data;
                });
            },
            // get all trainee of each class
            getTraineeList: function () {
                return $http.post('/trainee/courseRegister/getTraineeByClassId').success(function (data) {
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

    getOpeningClassController.$inject = ['$scope', '$rootScope', '$sce', 'openingclassService', 'courseDetailServices', '$timeout', 'dashboardServices'];

    function getOpeningClassController($scope, $rootScope, $sce, openingclassService, courseDetailServices, $timeout) {
        $scope.classListDetails = [];
        //$scope.classListName = [];
        $scope.flagDisplay = false;
        $scope.traineeList = [];
        //opt = 1 show opening
        //opt = 2 show closed
        //opt = 3 show incoming
        //opt = 4 show all
        // show opening as default
        $scope.opt = '1';
        // refresh data when model hidden
        $("#editClassModal").on('hidden.bs.modal', function () {
            $rootScope.adminClassModel.specificAttendant = [];

        });

        // get to class List
        openingclassService.getClassList().then(function (classListResult) {

            classListResult.data.data.forEach(function (element) {
                $scope.classListDetails.push(element);
            });
         });
        // get trainee list for each class
        openingclassService.getTraineeList().then(function (traineeListRs) {
            traineeListRs.data.data.forEach(function (element) {
                $scope.traineeList.push(element);
            })
        })

        // $scope.sortbyClassName = function() {
        //     $scope
        //         .classListName
        //         .sort(function(prevClass, nextClass){
        //             var upper_prevClass = prevClass
        //                 .Course.name
        //                 .toUpperCase();
        //             var upper_nextClass = nextClass 
        //                 .Course.name
        //                 .toUpperCase();
                    
        //             return upper_prevClass < upper_nextClass ?
        //                 -1 :
        //                 upper_prevClass > upper_nextClass ?
        //                 1 :
        //                 0;
        //         });                
        // };

        // $scope.sortbyLocation = function() {
        //     $scope
        //         .classListName
        //         .sort(function(prevLocation, nextLocation){
        //             var upper_prevLocation = prevLocation
        //                 .location
        //                 .toUpperCase();
        //             var upper_nextLocation = nextLocation 
        //                 .location
        //                 .toUpperCase();
                    
        //             return upper_prevLocation < upper_nextLocation ?
        //                 -1 :
        //                 upper_prevLocation > upper_nextLocation ?
        //                 1 :
        //                 0;
        //         });               
        // };

        // $scope.sortbyStartTime = function() {
        //     $scope
        //         .classListName
        //         .sort(function(prevStartTime, nextStartTime){
        //             return new Date(prevStartTime.startTime) - new Date(nextStartTime.startTime);
        //         });
        // };

        // $scope.sortbyEndTime = function() {
        //     $scope
        //         .classListName
        //         .sort(function(prevEndTime, nextEndTime){
        //             return new Date(prevEndTime.endTime) - new Date(nextEndTime.endTime);
        //         });
        // };

        // hightlight matching search
        $scope.highlight = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
        };

        

        //flag 
        $scope.flagCanEdit = 0;
        // check class status
        $scope.setStatus = function (endTime, startTime) {
            var start = Date.parse(startTime);
            var end = Date.parse(endTime);
            var curr = Date.now();
            $scope.flagCanEdit = 0;
            if (curr >= end) { // if closed
                return $sce.trustAsHtml(('<span class="label label-danger">Closed</span>'));
            } else if (end > curr && start <= curr) { // if opening
                return $sce.trustAsHtml(('<span class="label label-primary">Opening</span>'));
            } else { // else Incoming
                $scope.flagCanEdit = 1;
                return $sce.trustAsHtml(('<span  class="label label-info">Incoming</span>'));
            }
        };
        // flag: check display class or not
        $scope.flagDisplay = false;
        // filter and display class for each condition 
        $scope.checkSearchKey = (objClass, userSearchKey) => {
            if (userSearchKey) {
                return objClass.Course.name.toUpperCase().includes(userSearchKey.toUpperCase()) ||
                    objClass.location.toUpperCase().includes(userSearchKey.toUpperCase());
            }
            return true;
        }
        // filt by status
        $scope.checkStatus = (startTime, endTime, currTime, sttFilter) => {
            let checkStatus = false;
            if (currTime >= endTime && sttFilter === '2') { // if closed                
                checkStatus = true;
            } else if (endTime > currTime && startTime <= currTime && sttFilter === '1') { // if opening                
                checkStatus = true;
            } else if (startTime >= currTime && sttFilter === '3') { // else Incoming                
                checkStatus = true;
            } else {
                // do nothing
            }
            return checkStatus;
        }
        // filter to show class for each condition
        $scope.classListFilterCondition = function (cl) {
            var checkSearch = true;
            var start = Date.parse(cl.startTime);
            var end = Date.parse(cl.endTime);
            var curr = Date.now();
            var checkStatus = false;
            // check search
            checkSearch = $scope.checkSearchKey(cl, $scope.userSearchKey);
            // check status of class for each filter
            checkStatus = $scope.checkStatus(start, end, curr, $scope.opt);

            if ($scope.opt === '4') { // show all
                if (!$scope.flagDisplay)
                    $scope.flagDisplay = checkSearch;
                return checkSearch;
            }
            if (!$scope.flagDisplay) {
                $scope.flagDisplay = checkSearch && checkStatus;
            }

            return checkSearch && checkStatus;
        };

        // show notification when have no class
        $scope.showEmptyNoti = function () {
            if (!$scope.flagDisplay) {
                switch ($scope.opt) {
                    case '1': // have no opening class
                        return $sce.trustAsHtml(('<h4></br></br>Opening Class is Empty</h4>'));
                        break;
                    case '2': // have no closed class
                        return $sce.trustAsHtml(('<h4></br></br>Closed Class is Empty</h4>'));
                        break;
                    case '3': // have no icoming class
                        return $sce.trustAsHtml(('<h4></br></br>Incoming Class is Empty </h4>'));
                        break;
                    case '4': // have no class
                        return $sce.trustAsHtml(('<h4></br></br>Have No Class</h4>'));
                        break;
                    default:
                        break;
                }
            }
        };
        // export table class details excel 
        $scope.exportClassDetailsToExcel = function (cl, trainer) {
            $scope.fillContent2Table(cl, trainer);
            var blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]),
                document.getElementById('table_report').innerHTML
            ], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;text/plain;charset=utf-8;"
            });
            saveAs(blob, cl.Course.name + ".xls");
        }

        //////////////////////////////////////
        // fill content to table
        $scope.fillContent2Table = function (cl, trainer) {
            var table_report = document.getElementById("table_report");

            while (table_report.hasChildNodes())
                table_report.removeChild(table_report.firstChild);
            var tbl = document.createElement("table");
            tbl.id = "tbl-class-details";
            var tblBody = document.createElement("tbody");
            // create table with thead
            $scope.createTableTemplate(tblBody, cl, trainer);
            var indexClass;
            // find class in traineeList
            for (let i = 0; i < $scope.traineeList.length; ++i) {
                if (cl.id === $scope.traineeList[i].id) {
                    indexClass = i;
                    break;
                }
            }
            var totalRow = $scope.traineeList[indexClass].ClassRecords.length;
            //cells creation
            for (var indexRow = 0; indexRow < totalRow; indexRow++) {
                var row = document.createElement("tr");
                for (var indexCell = 0; indexCell < 3; indexCell++) {
                    var cell = document.createElement("td");
                    if (indexCell == 0) { // add index
                        var xrow = indexRow + 1;
                        cell.innerHTML = "<p style=\"font-size: 15px;text-align:center; \" >" + xrow + "</p>";
                    } else if (indexCell == 1) // add name trainee
                    {
                        cell.innerHTML = "<p style=\"font-size: 15px\" >" + $scope.traineeList[indexClass].ClassRecords[indexRow].User.username + "</p>";
                    } else { // add signature
                        cell.appendChild(document.createTextNode("              "));
                    }
                    row.appendChild(cell); // add cell to row
                }
                //row added to end of table body
                tblBody.appendChild(row);
            }
            tbl.appendChild(tblBody);
            table_report.appendChild(tbl);

            // tbl border attribute to 
            tbl.setAttribute("border", "1");
        };
        /// 
        //logo cu : http://sv1.upsieutoc.com/2017/10/20/logo8765870bacb08597.png
        //logo moi : http://sv1.upsieutoc.com/2018/08/02/logo7d8a1ffebc409472.png
        $scope.createTableTemplate = function (tblBody, cl, trainer) {
            tblBody.style.fontFamily = "Time New Roman";
            var row1 = document.createElement("tr");
            var th1 = document.createElement("td");
            var th2 = document.createElement("th");
            var th3 = document.createElement("td");
            th1.innerHTML = " </br> <img border-top=\"2\" border-left= \"2\" src='http://sv1.upsieutoc.com/2018/08/02/logo7d8a1ffebc409472.png' alt='hello'/> </br>";
            th1.style.width = "120px";
            th1.style.height = "70px";
            th2.innerHTML = "<p style=\"word-wrap: break-word; font-size: 20px;\" >" + cl.Course.name + " </p>";
            th3.innerHTML = "<p style=\"font-size: 16px\">Date: " + new Date(Date.parse(cl.startTime)).toDateString() + "</br> Place: " + cl.location + "</br> Trainer: " + trainer.username + "</br><b> *Kindly return this paper to Training Team after class </b> </p>";
            row1.appendChild(th1);
            row1.appendChild(th2);
            row1.appendChild(th3);
            tblBody.appendChild(row1);
            var row2 = document.createElement("tr");
            var th12 = document.createElement("th");
            var th22 = document.createElement("th");
            var th32 = document.createElement("th");
            th12.innerHTML = "<p style=\"font-size: 16px\">   # </br> </p>";
            th22.innerHTML = "<p style=\"font-size: 16px\"> Attendant </br></p>";
            th32.innerHTML = "<p style=\"font-size: 16px\"> Signarture </br></p>";
            row2.appendChild(th12);
            row2.appendChild(th22);
            row2.appendChild(th32);
            tblBody.appendChild(row2);
        };
        //Show Edit class form
        $scope.showEditClassForm = function (objclass, trainerName) {
            $scope.class_id = objclass.id;
            $rootScope.addEditFormIsEditForm = false;
            //Class
            $rootScope.editClassFormTitle = 'Edit Class';
            $rootScope.editClassFormAction = 'Update';
            //date and time
            var start = new Date(Date.parse(objclass.startTime));
            var end = new Date(Date.parse(objclass.endTime));

            $rootScope.timeOfStart = new Date();
            $rootScope.timeOfStart.setHours(start.getHours());
            $rootScope.timeOfStart.setMinutes(start.getMinutes());
            $rootScope.dayOfStart = new Date(Date.parse(objclass.startTime));
            $rootScope.timeOfEnd = new Date();
            $rootScope.timeOfEnd.setHours(end.getHours());
            $rootScope.timeOfEnd.setMinutes(end.getMinutes());
            $rootScope.dayOfEnd = new Date(Date.parse(objclass.startTime));

            //get list attendant in class
            var arrayAttendant = [];
            var indexClass;
            //find index of class in traineeList
            for (var i = 0; i < $scope.traineeList.length; ++i) {
                if (objclass.id === $scope.traineeList[i].id) {
                    indexClass = i;
                    break;
                }
            }
            // get all trainee in class has found
            var lengthOfTraineeList = $scope.traineeList[indexClass].ClassRecords.length;
            for (let i = 0; i < lengthOfTraineeList; i++) {
                arrayAttendant.push($scope.traineeList[indexClass].ClassRecords[i].User);
            }
            // add data for edit form
            $rootScope.adminClassModel = {

            };
        };
        $scope.setDateTimePicker = function (obj) {
            var tmp = new Date(Date.parse(obj.dayOfStart));
            tmp.setHours(obj.timeOfStart.getHours());
            tmp.setMinutes(obj.timeOfStart.getMinutes());
            return tmp;
        }
        $scope.setEndTimePicker = function (obj) {
            var tmp = new Date(Date.parse(obj.dayOfStart));
            tmp.setHours(obj.timeOfEnd.getHours());
            tmp.setMinutes(obj.timeOfEnd.getMinutes());
            return tmp;
        }
        // fill data to push into traineeList
        $scope.convert2PushTraineeList = (classDetailElement, objClassRecord) => {

            let tmp = {};
            if (objClassRecord) {
                var newJson = JSON.stringify(objClassRecord);
                let tmp = JSON.parse(newJson);
                tmp.id += 1;
            }
            var newJson2 = JSON.stringify(classDetailElement)
            let tmpUser = JSON.parse(newJson2);
            delete tmpUser.Classes
            tmp.User = tmpUser;
            tmp.traineeId = tmpUser.id;
            
            return tmp;
        }
        //edit class
        $scope.editClassClick = function () {
            $rootScope.dateTimePicker = $scope.setDateTimePicker($rootScope.adminClassModel)
            $rootScope.adminClassModel.startTime = $rootScope.dateTimePicker;
            $rootScope.endTimePicker = $scope.setEndTimePicker($rootScope.adminClassModel)
            $rootScope.adminClassModel.endTime = $rootScope.endTimePicker;

            //array contain trainee in class
            var AttendantList = [];
            //check new attendee is Exit
            var newAttendant = [];
            // check delete attendee
            var delAttendant = [];
            // find position of class on traineeListData
            const indexClass = $scope.getIndexTraineeListByClass($scope.class_id);
            // get all trainee in class has found
            const lengthOfTraineeList = $scope.traineeList[indexClass].ClassRecords.length;
            for (let j = 0; j < lengthOfTraineeList; j++) {
                AttendantList.push($scope.traineeList[indexClass].ClassRecords[j].User);
            }

            // get all new trainee
            for (let j = 0; j < lengthOfTraineeList; j++) {
                if ($rootScope.adminClassModel.specificAttendant.indexOf(AttendantList[j]) < 0) {
                    delAttendant.push(AttendantList[j]);
                }
            }
            // get all del tranee
            for (let j = 0; j < $rootScope.adminClassModel.specificAttendant.length; j++) {
                if (AttendantList.indexOf($rootScope.adminClassModel.specificAttendant[j]) < 0) {
                    newAttendant.push($rootScope.adminClassModel.specificAttendant[j]);
                }
            }
            // save newAttendant array to rootScope
            $rootScope.adminClassModel.newAttendant = newAttendant;
            //save delAttendant array to rootScope
            $rootScope.adminClassModel.delAttendant = delAttendant;
            // save class id have been edited to rootScope
            $rootScope.adminClassModel.classid = $scope.class_id;

            // post to courseDetailServices controller and edit
            courseDetailServices.editClass($rootScope.adminClassModel).then(function (result) {
                if (result.data.success) {

                    const indexOfClass = $scope.traineeList.findIndex(obj => obj.id === $rootScope.adminClassModel.classid);

                    //loop for update time of class                    
                    for (let i = 0; i < $scope.classListDetails.length; i++) {
                        let index = $scope.classListDetails[i].Classes
                            .findIndex(classElement => classElement.id === $scope.class_id)
                        if (index !== -1) {
                            $scope.classListDetails[i].Classes[index].startTime = $rootScope.adminClassModel.startTime;
                            $scope.classListDetails[i].Classes[index].endTime = $rootScope.adminClassModel.endTime;
                            $scope.classListDetails[i].Classes[index].location = $rootScope.adminClassModel.location;
                        }
                    }

                    // loop to add new member to class
                    for (let i = 0; i < newAttendant.length; i++) {
                        // find index of trainee in list to get data of trainee
                        let indexOfTrainee = $scope.classListDetails.findIndex(obj => obj.id === newAttendant[i].id);
                        // get data and format to push into class record
                        let newUser = $scope.convert2PushTraineeList($scope.classListDetails[indexOfTrainee],
                            $scope.traineeList[indexOfClass].ClassRecords.slice(-1).pop());
                        $scope.traineeList[indexOfClass].ClassRecords.push(newUser);
                    }
                    // loop to delete member out of class
                    for (let i = 0; i < delAttendant.length; i++) {
                        // find index trainee in class record
                        let indexOfTraineeInClassRecord = $scope.traineeList[indexOfClass].ClassRecords.findIndex(obj => obj.traineeId === delAttendant[i].id);
                        // delete trainee out of class
                        $scope.traineeList[indexOfClass].ClassRecords.splice(indexOfTraineeInClassRecord, 1);
                    }
                    $rootScope.ShowPopupMessage("Edit Class Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Your class can't be edited", "error");
                }
            });
        };
        //
        $scope.getIndexTraineeListByClass = function (classId) {
            //find trainee list        
            for (let i = 0; i < $scope.traineeList.length; ++i) {
                if (classId === $scope.traineeList[i].id) {
                    return i;
                }
            }
        }
        // get num of trainee by index 
        $scope.getNumOfTrainee = function (cl) {
            const index = $scope.getIndexTraineeListByClass(cl.id);
            if ($scope.traineeList[index]) {
                return $scope.traineeList[index].ClassRecords.length;
            }
            return 0;
        }
        // get class want to delete
        $scope.getDeleteClass = function (Class) {
            $scope.classDelete = Class;
            $scope.classDelete.traineeList = [];
            var indexClass;
            indexClass = $scope.getIndexTraineeListByClass(Class.id);
            // get all trainee in class has found
            var lengthOfTraineeList = $scope.traineeList[indexClass].ClassRecords.length;
            for (let i = 0; i < lengthOfTraineeList; i++) {
                $scope.classDelete.traineeList.push($scope.traineeList[indexClass].ClassRecords[i].User);
            }
        };
        // delete class function
        $scope.DeleteClass = function () {
            courseDetailServices.deleteClass($scope.classDelete).then(function (result) {

                if (result.data.success) {
                    const trainerId = $scope.classDelete.trainerId;
                    const classId = $scope.classDelete.id;
                    $scope.classListDetails.forEach((classListDetail, indexClassListDetail) => {
                        if (classListDetail.id === trainerId) {
                            $scope.classListDetails[indexClassListDetail].Classes.forEach((Class, indexClass) => {
                                if (Class.id === classId) {
                                    $scope.classListDetails[indexClassListDetail].Classes.splice(indexClass, 1);
                                }
                            });
                        }
                    });
                    $rootScope.ShowPopupMessage("Delete Class Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage('Fail to Delete Class!', "error");
                }

            });
        };
    }
})();