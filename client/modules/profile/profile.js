'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('qibud.profile', [
      'ui.router',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.profile', {
            url: "/profile",
            title: 'User Profile',
            breadcrumb: {
              class: 'highlight',
              text: 'User Profile',
              stateName: 'bud.profile'
            },
            templateUrl: 'modules/profile/profile.html',
            controller: 'ProfileCtrl'
      });
    });
