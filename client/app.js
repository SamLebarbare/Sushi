'use strict';

/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular
    .module('koan', [
      'ui.router',
      'qibud.common',
      'qibud.home',
      'qibud.viewer',
      'qibud.editor',
      'koan.profile'
    ])

    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
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
