'use strict';

/**
 * Bud result
 */

angular
    .module('qibud.org.results', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Result', {
            url: '/result',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-results/view.html',
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
                templateUrl: 'budPacks/qibud-org-results/view.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Result Editor',
              stateName: 'bud.editor.Result'
            }
          });
    });
