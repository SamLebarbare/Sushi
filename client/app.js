'use strict';
/**
 * Top level module. Lists all the other modules as dependencies.
 */

angular
    .module('sushi', [
      'ngSanitize',
      'ngCookies',
      'ui.tinymce',
      'ui.router',
      'ui.router.breadcrumbs',
      'sushi.common',
      'sushi.dashboard',
      'sushi.home',
      'sushi.viewer',
      'sushi.editor',
      'sushi.profile',
      'sushi.org.teams',
      'sushi.org.ideas',
      'sushi.org.missions',
      'sushi.org.projects',
      'sushi.org.actions',
      'sushi.org.results',
      'sushi.org.issues',
      'sushi.org.infos',
      'sushi.org.meetings',
      'sushi.org.regions',
      'sushi.org.customers',
      'sushi.org.products',
      'smart-table',
      'angularFileUpload',
      'growlNotifications'
    ])

    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home/stickers");
      $stateProvider
          .state('sushi', {
            abstract: true,
            url: '/sushis',
            template: '<div data-ui-view></div>'});
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

        api.userupdate.subscribe(function (user) {
          if (user.id === common.user.id) {
            common.user = user;
          }
        });

        api.disconnected.subscribe(function () {
          common.onlineIndicatorStyle = {'background-color': 'lightgrey'};
        });

      });
    });
