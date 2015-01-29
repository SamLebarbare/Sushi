'use strict';
/**
 * Bud Info
 */

angular
    .module('qibud.org.infos', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Info', {
            url: '/idea',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-infos/view.html',
                controller: 'InfoViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Info',
              stateName: 'bud.viewer.Info'
            },
          });
    });
