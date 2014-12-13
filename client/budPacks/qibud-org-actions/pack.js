'use strict';

/**
 * Bud project
 */

angular
    .module('qibud.org.actions', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Action', {
            url: '/action',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-actions/view.html',
                controller: 'ActionViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Action',
              stateName: 'bud.viewer.Action'
            }
          })
          .state('bud.editor.Action', {
            url: '/action',
            views: {
              'summary':{
                controller: 'ActionViewerCtrl',
                templateUrl: 'budPacks/qibud-org-actions/view.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Action Editor',
              stateName: 'bud.editor.Action'
            }
          });
    });
