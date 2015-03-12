'use strict';

/**
 * Bud project
 */

angular
    .module('sushi.org.projects', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Project', {
            url: '/project',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-projects/view.html',
                controller: 'ProjectViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Project',
              stateName: 'bud.viewer.Project'
            }
          })
          .state('bud.editor.Project', {
            url: '/project',
            views: {
              'summary':{
                controller: 'ProjectViewerCtrl',
                templateUrl: 'budPacks/sushi-org-projects/view.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Project Editor',
              stateName: 'bud.editor.Project'
            }
          });
    });
