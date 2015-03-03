'use strict';
/**
 * regions
 */

angular
    .module('qibud.org.regions', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Region', {
            url: '/region',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-regions/view.html',
                controller: 'RegionViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Region',
              stateName: 'bud.viewer.Region'
            },
          });
    });
