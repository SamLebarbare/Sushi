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
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Viewer',
              stateName: 'viewer'
            },
            templateUrl: 'modules/viewer/viewer.html',
            controller: 'ViewerCtrl'
      });
    });
