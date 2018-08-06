(function () {
    'use strict';

    angular.module('adminSetting', [])
        .factory('settingServices', settingServices)
        .controller('adminSettingCtrl', adminSettingCtrl);

    settingServices.$inject = ['$http'];
    function settingServices($http){
        var factoryDefinitions = {
            getValueByName: function(request){
                return $http
                .post('/common/setting/getValueByName', request).success(function(data){
                    return data;
                });
            },
            updateSettingByName: function(request){
                return $http
                .post('/common/setting/updateSettingByName', request).success(function(data){
                    return data;
                });
            }
        }
        return factoryDefinitions;
    }
    adminSettingCtrl.$inject = ['$scope', '$rootScope', 'settingServices' ];
    function adminSettingCtrl($scope, $rootScope, settingServices){
        settingServices.getValueByName({name:'numberHighDemand'}).then(function(result){
            $scope.numberHighDemand = result.data.data;
            // $scope.numberUpdateHighDemand = $scope.numberHighDemand;
        });
        $scope.updateNumberHighDemand = function(){
            settingServices.updateSettingByName({name:'numberHighDemand', value:$scope.numberUpdateHighDemand}).then(function(result){
                $scope.numberHighDemand = $scope.numberUpdateHighDemand;
                $rootScope.ShowPopupMessage("Update Successfully", "success");
            });
        }

    }
})();
