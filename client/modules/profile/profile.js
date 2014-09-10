'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('koan.profile', [
      'ui.router',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
      $stateProvider
          .state('profile', {
            url: "/profile",
            title: 'User Profile',
            templateUrl: 'modules/profile/profile.html',
            controller: 'ProfileCtrl'
      });
    });
