'use strict';

/**
 * Bud project
 */

angular
    .module('qibud.org.issues', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Issue', {
            url: '/Issue',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-issues/view.html',
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
