(function () {
    'use strict';
    // Declare app level module which depends on views, and components
    angular
        .module('myApp', [
            'ui.router',
            'ui.bootstrap',
            'validation',
            'validation.rule',
            'textAngular',
            'users',
            'trainee_dashboard',
            'trainee_courseRegister',
            'home',
            'calendarModule',
            'ngTagsInput',
            'courseDetail',
            'admin_courseManagement',
            'admin_dashboard',
            'EmployeesManagement',
            'openingclass',
            'register',
            'notification',
            'infinite-scroll',
            'adminSetting',
            'admin_classAdding'
            

            // , 'ngCookies'
        ])

        //Config phase
        .config(function ($urlRouterProvider, $httpProvider, $stateProvider) {
            //automatically attach token to header request package
            $httpProvider.interceptors.push('authInterceptor');

            //session check and redirect to specific state
            if (!window.sessionStorage["userInfo"]) {
                $urlRouterProvider.otherwise("home");
            }


            $stateProvider
                //Login
                .state('login', {
                    templateUrl: 'partials/common/loginHeader.html',
                    controller: 'loginController'
                })
                // Login user
                .state('login_user', {
                    url: '/login_user/:param1',
                    templateUrl: 'partials/login/login_user.html',
                    onEnter: function(){
                        window.localStorage.setItem('currentState', '/#/login_user');
                    }
                })
                .state('setting', {
                    url:'/setting',
                    templateUrl: 'partials/common/setting.html',
                    controller: 'adminSettingCtrl'
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'partials/register/registerModal.html'
                })
                // .state('calendar', {
                //     templateUrl: 'partials/calendarModule/calendar.html',
                //     controller: 'calendarController'
                // })
                .state('home', {
                    url: '/home',
                    //templateUrl: 'partials/home/home.html',
                    templateUrl: 'partials/home/home_curriculum.html',
                    controller: 'homeCtrl'
                })
                .state('notification', {
                    url: "/notification",
                    templateUrl: 'partials/notification/notification.html',
                    controller: 'NotiController'
                })
                .state('admin_courseManagement', {
                    url: '/admin_courseManagement',
                    templateUrl: 'partials/adminModule/courseManagement/courseManagement.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                    onEnter: function(){
                        window.localStorage.setItem('currentState', '/#/admin_courseManagement');
                    },
                }) //adding in here
                .state('admin_classAdding',{
                    url: '/admin_classAdding',
                    templateUrl: 'partials/adminModule/classAdding/admin_classAdding.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                    onEnter: function(){
                        window.localStorage.setItem('currentState', '/#/admin_classAdding');
                    },
                }) //end
                .state('admin_dashboard', {
                    url: '/admin_dashboard',
                    //  templateUrl: 'partials/adminModule/dashboard/dashboard.html',
                    templateUrl: 'partials/adminModule/dashboard/adminDashboard.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                .state('EmployeesManagement', {
                    url: '/EmployeesManagement',
                    templateUrl: 'partials/adminModule/EmployeesManagement/EmployeesManagement.html',
                    controller: 'getProfilesController',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                    onEnter: function(){
                        window.localStorage.setItem('currentState', '/#/EmloyeesManagement');
                    },
                })
                .state('OpeningClass', {
                    url: '/OpeningClass',
                    templateUrl: 'partials/adminModule/openingclass/openingclass.html',
                    controller: 'getOpeningClassController',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                    onEnter: function(){
                        window.localStorage.setItem('currentState', '/#/OpeningClass');
                    },
                })

                .state('courseDetail', {
                    url: "/courseDetail",
                    templateUrl: 'partials/common/course/courseDetail.html',
                    controller: 'courseDetailCtrl',
                    params: {
                        courseId: null,
                    },
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })

                .state('trainee_courseRegister', {
                    url: '/trainee_courseRegister',
                    templateUrl: 'partials/traineeModule/courseRegister/courseRegister.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                .state('trainee_dashboard', {
                    url: '/trainee_dashboard',
                    //templateUrl: 'partials/traineeModule/dashboard/dashboard.html',
                    templateUrl: 'partials/traineeModule/dashboard/traineeDashboard.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                .state('detail_notification', {
                    url: '/detail_notification',
                    templateUrl: 'partials/traineeModule/dashboard/detailNotification.html',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                .state('adminSetting', {
                    url:'/adminSetting',
                    controller: 'adminSettingCtrl',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                //Change Password
                .state('changePassword', {
                    templateUrl: '',
                    controller: 'changePasswordController',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                //Logout
                .state('logout', {
                    url: "/logout",
                    template: "",
                    controller: 'logoutController',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                //userProfile
                .state('userProfile', {
                    url: "/userProfile",
                    templateUrl: 'partials/users/userProfile.html',
                    controller: 'userProfileCtrl',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
                //editUserProfile
                .state('editUserProfile', {
                    url: "/editUserProfile",
                    templateUrl: 'partials/users/editUserProfile.html',
                    controller: 'userProfileCtrl',
                    resolve: {
                        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
                    },
                })
        })

        //Run phase
        .run(function ($rootScope, $state, $anchorScroll, $transitions,$stateParams) {
            var admin_page = ['admin_dashboard', 'admin_courseManagement', 'OpeningClass', 'EmployeesManagement','admin_classAdding'];
            $transitions.onStart({}, function ($transition) {
                if (admin_page.indexOf($transition.$to().name) >= 0 &&
                    !$rootScope.userInfo.isAdmin) {
                    $state.go($transition.$from().name);
                    }
            });
            //check remember me

            $rootScope.$state = $state; //Get state info in view

            $anchorScroll.yOffset = 400;

            $rootScope.ShowPopupMessage = function (message, popupType) {
                $rootScope.popUpMessage = message;
                //--show the pop up to infor login result
                var popup = document.getElementById("popUpMessage")
                popup.className = popupType; //success (green), error (red), info(light blue).  custom more by add more style class to css/style.css
                setTimeout(function () {
                    popup.className = ""
                }, 3000);
                //--end: show the pop
            }

            if (window.sessionStorage["userInfo"]) {
                $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
            }
            //Check session and redirect to specific page
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                window.localStorage.setItem('currentPage', window.location.pathname);
                if (toState.data.auth && !window.sessionStorage["userInfo"]) {
                    event.preventDefault();
                    window.location.href = "#home";
                }
                if (!toState.data.auth && window.sessionStorage["userInfo"]) {
                    event.preventDefault();
                    if ($rootScope.userInfo.role === 3) {
                        window.location.href = "#trainee_dashboard";
                    } else if ($rootScope.userInfo.role === 2) {
                        window.location.href = "#trainer_dashboard";
                    } else if ($rootScope.userInfo.role === 1) {
                        window.location.href = "#admin_dashboard";
                    }
                }
             });
        })
        //Datatable
        .factory('dataTable', ['$filter', 'ngTableParams', function ($filter, ngTableParams) {

            var factoryDefinition = {
                render: function ($scope, config, componentId, data) {
                    if (!config) {
                        config = {};
                    }

                    config = angular.extend({}, {
                        page: 1,
                        count: 10
                    }, config)

                    $scope[componentId] = new ngTableParams(config, {
                        total: data.length, // length of data
                        getData: function ($defer, params) {
                            // use build-in angular filter
                            var filteredData = params.filter() ?
                                $filter('filter')(data, params.filter()) :
                                data;
                            var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) :
                                data;
                            params.total(orderedData.length); // set total for recalc pagination
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });


                }
            }

            return factoryDefinition;
        }])
        .factory('authInterceptor', authInterceptor)
        //main controller
        // .factory("statePersistenceService", [
        //     "$cookies", function($cookies) {
        //         var WebState = "";

        //         return {
        //             setCookieData: function(state) {
        //                 WebState = state;
        //                 $cookies.put("WebState", state);
        //             },
        //             getCookieData: function() {
        //                 WebState = $cookies.get("WebState");
        //                 return WebState;
        //             },
        //             clearCookieData: function() {
        //                 WebState = "";
        //                 $cookies.remove("Webstate");
        //             }
        //         }
        //     }
        // ])

        .factory('Features', function($http) {
            $http
                .get('/features.json')
                .success(function (data) {
                    return data;
                });
        })
        .directive('featureToggle', function($http) {
            return {
                restrict: 'E',
                template: '<span ng-transclude></span>',
                transclude: true,
                link: function(scope, element, attrs, ctrl, transclude) {
                    $http.get('/features.json')
                        .success(function (response) {
                        scope.$parent.featureToggle = response;
                    });
                }
            };
          })

        .controller('mainController', mainController);
        // .directive('fallbackSrc', function () {
        //     var fallbackSrc = {
        //       link: function postLink(scope, iElement, iAttrs) {
        //         iElement.bind('error', function() {
        //           angular.element(this).attr("src", iAttrs.fallbackSrc);
        //         });
        //       }
        //      }
        //      return fallbackSrc;
        //   });
    authInterceptor.$inject = ['$q', '$window', '$state', '$location', '$rootScope'];

    function authInterceptor($q, $window, $state, $location, $rootScope) {

        var services = {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage['token']) {
                    config.headers['x-access-token'] = $window.localStorage['token'];
                }
                return config;
            },
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                if (response.status === 403) {
                    // handle the case where the user is not authenticated
                    delete $window.localStorage['token'];
                    sessionStorage.clear();
                    $rootScope.userInfo = false;
                    $rootScope.ShowPopupMessage("Logout successfully", "success");
                    $state.go('home');
                    //erase cookie
                    document.cookie = "email=;expires=" + (Date.now() - 1000) + ";path=/";
                }
                return response;
            }
        };
        return services;
    }

    mainController.$inject = ['$rootScope', 'dashboardServices', 'userServices', '$scope'];

    function mainController($rootScope, dashboardServices, userServices, $scope) {

    }

    _redirectIfNotAuthenticated.$inject = ['$q', '$state', '$timeout', '$rootScope'];

    function _redirectIfNotAuthenticated($q, $state, $timeout, $rootScope) {
        var defer = $q.defer();
        if (window.sessionStorage["userInfo"]) {
            defer.resolve(); /* (3) */
        } else {
            $timeout(function () {
                $state.go('home'); /* (4) */
            });
            defer.reject();
        }
        return defer.promise;
    }


})();

//For top sub menu (look others menu)
$(function () {
    $('.subnavbar').find('li').each(function (i) {
        var mod = i % 3;
        if (mod === 2) {
            $(this).addClass('subnavbar-open-right');
        }
    });
});
