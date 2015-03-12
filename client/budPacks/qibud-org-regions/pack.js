'use strict';
/**
 * regions
 */

angular
    .module('sushi.org.regions', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Region', {
            url: '/region',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-regions/view.html',
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
