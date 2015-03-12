'use strict';

/**
 * Bud Team
 */

angular
    .module('sushi.org.teams', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Team', {
            url: '/team',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-teams/view.html',
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
