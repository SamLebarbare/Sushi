'use strict';

/**
 * Editor module for buds
 */

angular
    .module('qibud.viewer', [
      'ui.router',
      'monospaced.elastic',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");
      $stateProvider
          .state('viewer', {
            url: "/viewer/:budId",
            title: 'Qibud',
            templateUrl: 'modules/viewer/viewer.html',
            controller: 'ViewerCtrl'
      });
    });
