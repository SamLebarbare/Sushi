'use strict';

/**
 * Editor module for buds
 */

angular
    .module('qibud.viewer', [
      'ui.router',
      'ui.bootstrap',
      'monospaced.elastic',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('viewer', {
            url: "/viewer/:budId",
            title: 'Qibud',
            templateUrl: 'modules/viewer/viewer.html',
            controller: 'ViewerCtrl'
      });
    });
