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
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.team', {
            url: '/team',
            controller: 'TeamViewerCtrl',
            templateUrl: 'budPacks/qibud-org-teams/view.html',
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Team',
              stateName: 'bud.viewer.team'
            },
          })
          .state('bud.editor.team', {
            url: '/team',
            controller: 'TeamEditorCtrl',
            templateUrl: 'budPacks/qibud-org-teams/edit.html',
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Team Editor',
              stateName: 'bud.editor.team'
            },
          });
    });
