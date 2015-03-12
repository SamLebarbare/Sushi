'use strict';

/**
 * Editor module for buds
 */

angular
    .module('sushi.editor', [
      'ui.router',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('bud.editor', {
            title: 'sushi Editor',
            url: "/editor/:budId/:parentBudId/:content",
            breadcrumb: {
              class: 'highlight',
              text: 'Bud Editor',
              stateName: 'bud.editor'
            },
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
