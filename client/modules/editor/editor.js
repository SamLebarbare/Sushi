'use strict';

/**
 * Editor module for sushis
 */

angular
    .module('sushi.editor', [
      'ui.router',
      'sushi.common'
    ])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('sushi.editor', {
            title: 'sushi Editor',
            url: "/editor/:sushiId/:parentSushiId/:content",
            breadcrumb: {
              class: 'highlight',
              text: 'Sushi Editor',
              stateName: 'sushi.editor'
            },
            templateUrl: 'modules/editor/editor.html',
            controller: 'EditorCtrl'
      });
    });
