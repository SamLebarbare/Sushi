'use strict';

/**
 * Bud Teams view
 */

angular
    .module('qibud.org.teams', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider) {
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
          })
          .state('bud.editor.Team', {
            url: '/team',
            controller: 'TeamEditorCtrl',
            templateUrl: 'budPacks/qibud-org-teams/edit.html',
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Team Editor',
              stateName: 'bud.editor.Team'
            },
          });
    });
