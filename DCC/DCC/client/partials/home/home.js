(function () {
    'use strict';

    angular.module('home', [
            'calendarModule'
        ])
        .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope'];

    function homeCtrl($scope) {
        $scope.templates = {
            name: 'template3.html',
            url: 'partials/calendarModule/calendar.html'
        };
    }
})();