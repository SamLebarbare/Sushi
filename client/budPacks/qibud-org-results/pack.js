'use strict';

/**
 * Bud result
 */

angular
    .module('sushi.org.results', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Result', {
            url: '/result',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-results/view.html',
                controller: 'ResultViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Result',
              stateName: 'bud.viewer.Result'
            }
          })
          .state('bud.editor.Result', {
            url: '/result',
            views: {
              'summary':{
                controller: 'ResultViewerCtrl',
                templateUrl: 'budPacks/sushi-org-results/view.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Result Editor',
              stateName: 'bud.editor.Result'
            }
          });
    });
