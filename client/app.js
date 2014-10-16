'use strict';

/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular
    .module('qibud', [
      'ngSanitize',
      'ngCookies',
      'ui.tinymce',
      'ui.router',
      'ui.router.breadcrumbs',
      'qibud.common',
      'qibud.home',
      'qibud.viewer',
      'qibud.editor',
      'qibud.profile',
      'qibud.org.teams'
    ])

    .controller('DashboardCtrl', ['$scope', '$cookieStore', DashboardCtrl])

    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
      $stateProvider
          .state('bud', { abstract: true, url: '/buds', template: '<div data-ui-view></div>'});
    })

    .run(function ($location, $rootScope, $window, api) {
      // attach commonly used info to root scope to be available to all controllers/views
      var common = $rootScope.common = $rootScope.common || {
        active: {},
        user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
        logout: function () {
          delete $window.sessionStorage.token;
          delete $window.sessionStorage.user;
          delete $window.localStorage.token;
          delete $window.localStorage.user;
          $window.location.replace('/signin.html');
        },
        clearDatabase: function () {
          var self = this;
          api.debug.clearDatabase().success(function () {
            self.logout();
          });
        }
      };

      // declare websocket event listeners for backend api
      api.connected.subscribe(function () {
        common.onlineIndicatorStyle = {'background-color': 'green'};
      });

      api.disconnected.subscribe(function () {
        common.onlineIndicatorStyle = {'background-color': 'lightgrey'};
      });

    });


    function DashboardCtrl($scope, $cookieStore) {
        /**
         * Sidebar Toggle & Cookie Control
         *
         */
        var mobileView = 992;

        $scope.getWidth = function() { return window.innerWidth; };

        $scope.$watch($scope.getWidth, function(newValue, oldValue)
        {
            if(newValue >= mobileView)
            {
                if(angular.isDefined($cookieStore.get('toggle')))
                {
                    if($cookieStore.get('toggle') == false)
                    {
                        $scope.toggle = false;
                    }
                    else
                    {
                        $scope.toggle = true;
                    }
                }
                else
                {
                    $scope.toggle = true;
                }
            }
            else
            {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function()
        {
            $scope.toggle = ! $scope.toggle;

            $cookieStore.put('toggle', $scope.toggle);
        };

        window.onresize = function() { $scope.$apply(); };
    }
