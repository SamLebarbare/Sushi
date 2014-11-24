'use strict';

/**
 * Bud Idea
 */

angular
    .module('qibud.org.ideas', [
      'ui.router',
      'ui.bootstrap',
      'qibud.common'
    ])
    .config(function ($stateProvider, $stickyStateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Idea', {
            url: '/idea',
            views: {
              'summary':{
                templateUrl: 'budPacks/qibud-org-ideas/view.html',
                controller: 'IdeaViewerCtrl'
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Idea',
              stateName: 'bud.viewer.Idea'
            },
          })
          .state('bud.editor.Idea', {
            url: '/idea',
            views: {
              'summary':{
                controller: 'IdeaEditorCtrl',
                templateUrl: 'budPacks/qibud-org-ideas/edit.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Idea Editor',
              stateName: 'bud.editor.Idea'
            },
          });
    });
