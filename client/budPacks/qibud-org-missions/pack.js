'use strict';

/**
 * Bud mission
 */

angular
    .module('sushi.org.missions', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Mission', {
            url: '/mission',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-missions/view.html',
                controller: 'MissionViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Mission',
              stateName: 'bud.viewer.Mission'
            }
          })
          .state('bud.editor.Mission', {
            url: '/mission',
            views: {
              'summary':{
                controller: 'MissionViewerCtrl',
                templateUrl: 'budPacks/sushi-org-missions/view.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Mission Editor',
              stateName: 'bud.editor.Mission'
            }
          });
    });
