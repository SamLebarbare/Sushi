'use strict';

/**
 * Bud Team
 */

angular
    .module('qibud.org.teams', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Team', {
            url: '/team',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-teams/view.html',
                controller: 'TeamViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Team',
              stateName: 'bud.viewer.Team'
            },
          });
    });
