'use strict';

/**
 * Bud project
 */

angular
    .module('sushi.org.issues', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Issue', {
            url: '/Issue',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-issues/view.html',
                controller: 'IssueViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Issue',
              stateName: 'bud.viewer.Issue'
            }
          });
    });
