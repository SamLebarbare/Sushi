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
      'ct.ui.router.extras',
      'qibud.common',
      'qibud.dashboard',
      'qibud.home',
      'qibud.viewer',
      'qibud.editor',
      'qibud.profile',
      'qibud.org.teams',
      'qibud.org.ideas'
    ])

    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
      $stateProvider
          .state('bud', { abstract: true, url: '/buds', template: '<div data-ui-view></div>'});
      $stateProvider
            .state('home', { abstract: true, url: '/home', template: '<div data-ui-view></div>'});
    })

    .run(function ($location, $rootScope, $window, api) {
      // attach commonly used info to root scope to be available to all controllers/views
      api.types.list().success(function (types)
      {
        var common = $rootScope.common = $rootScope.common || {
          active: {},
          user: JSON.parse($window.sessionStorage.user || $window.localStorage.user),
          availableTypes: types,
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
    });
