'use strict';
/**
 * Bud Info
 */

angular
    .module('sushi.org.infos', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Info', {
            url: '/idea',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-infos/view.html',
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
