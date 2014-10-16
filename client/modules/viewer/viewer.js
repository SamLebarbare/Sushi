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
          .state('bud.viewer', {
            url: "/viewer/:budId",
            title: 'Qibud',
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Viewer',
              stateName: 'bud.viewer'
            },
            templateUrl: 'modules/viewer/viewer.html',
            controller: 'ViewerCtrl'
      });
    });
