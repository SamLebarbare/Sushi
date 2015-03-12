'use strict';
/**
 * Bud Idea
 */

angular
    .module('sushi.org.ideas', [
      'ui.router',
      'ui.bootstrap',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.viewer.Idea', {
            url: '/idea',
            views: {
              'summary':{
                templateUrl: 'budPacks/sushi-org-ideas/view.html',
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
                templateUrl: 'budPacks/sushi-org-ideas/edit.html',
              }
            },
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Idea Editor',
              stateName: 'bud.editor.Idea'
            },
          });
    });
